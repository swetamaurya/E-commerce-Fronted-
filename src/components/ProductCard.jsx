import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { cartApi, wishlistApi } from "../services/api";
import { toast } from "react-toastify";
import { getImageUrl } from "../utils/imageUtils";
import { 
  addToGuestCart, 
  addToGuestWishlist, 
  removeFromGuestWishlist, 
  isInGuestWishlist 
} from "../utils/guestStorage";

export default function ProductCard({ 
  product, 
  viewMode = "grid", 
  category: forcedCategory,
  wishlistStatus = false,
  onWishlistChange
}) {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(wishlistStatus);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  // Normalize images and find primary image
  const images = useMemo(() => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images
        .map((img) => {
          const url = typeof img === "string" ? img : img?.url;
          return {
            url: getImageUrl(url),
            alt: typeof img === "string" ? product.name || product.title : img?.alt || product.name || product.title,
            isPrimary: typeof img === "string" ? false : Boolean(img?.isPrimary)
          };
        })
        .filter((i) => i.url);
    }
    return product?.image ? [{ url: getImageUrl(product.image), alt: product.name || product.title, isPrimary: true }] : [];
  }, [product]);
  
  // Debug: Log product data for troubleshooting
  console.log('🔍 ProductCard Debug:', {
    productName: product?.name,
    imagesCount: images.length,
    images: images.map(img => ({ url: img.url, isPrimary: img.isPrimary })),
    primaryImages: images.filter(img => img.isPrimary === true)
  });

  // Find primary image or use first image as fallback
  const primaryImage = images.find(img => img.isPrimary === true) || images[0];
  const primaryImg = primaryImage?.url || getImageUrl(product?.image) || null;
  const hoverImg = images.find(img => img.isPrimary !== true)?.url || images[1]?.url || images[0]?.url || getImageUrl(product?.image) || null;

  console.log('🎯 Selected primary image:', primaryImg);

  // Extract variant data for display
  const variant = product?.variants?.[0] || {};
  const displaySize = variant.size || product?.size || (product?.sizes && product.sizes.join(', '));
  const displayColor = variant.color || product?.color || (product?.colors && product.colors.join(', '));
  const displayThickness = product?.thickness || product?.meterial;

  // Update wishlist status when props change
  useEffect(() => {
    setIsWishlisted(wishlistStatus);
  }, [wishlistStatus]);

  // Check wishlist status (both logged in and guest users)
  useEffect(() => {
    if (onWishlistChange) {
      // Parent is managing wishlist status, no need to check individually
      return;
    }
    
    const checkWishlistStatus = async () => {
      try {
        const productId = product.id || product._id;
        
        if (localStorage.getItem("token")) {
          // Logged in user - check server wishlist
          const timeoutId = setTimeout(async () => {
            try {
              const res = await wishlistApi.checkWishlistItem(productId);
              setIsWishlisted(!!res?.inWishlist);
            } catch (e) {
              console.error("Error checking wishlist status:", e);
              setIsWishlisted(false);
            }
          }, 100); // 100ms debounce
          
          return () => clearTimeout(timeoutId);
        } else {
          // Guest user - check local storage
          setIsWishlisted(isInGuestWishlist(productId));
        }
      } catch (e) {
        console.error("Error in wishlist check setup:", e);
        setIsWishlisted(false);
      }
    };
    
    checkWishlistStatus();
  }, [product.id || product._id, onWishlistChange]);

  // Convert category name to URL-friendly format
  const categoryToUrl = (categoryName) => {
    if (!categoryName) return "cotton-yoga-mats";
    
    const categoryMap = {
      "Cotton Yoga Mats": "cotton-yoga-mats",
      "Bedside Runners": "bedside-runners", 
      "Mats Collection": "mats-collection",
      "Bath Mats": "bath-mats",
      "Area Rugs": "area-rugs",
      "In Door Mats": "mats-collection",
      "Out Door Mats": "mats-collection"
    };
    
    return categoryMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-');
  };

  const handleProductClick = () => {
    const catFromPath = window.location.pathname.split("/")[1] || "cotton-yoga-mats";
    const category = forcedCategory || categoryToUrl(product?.category) || catFromPath;
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate(`/${category}/${product.id || product._id}`);
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    setIsTogglingWishlist(true);
    
    try {
      const productId = product.id || product._id;
      const productData = {
        productId: productId,
        title: product.name || product.title,
        price: product.price,
        image: primaryImg,
      };
      
      if (localStorage.getItem("token")) {
        // Logged in user - use API
        if (isWishlisted) {
          await wishlistApi.removeFromWishlist(productId);
          setIsWishlisted(false);
          toast.success("Removed from wishlist");
        } else {
          await wishlistApi.addToWishlist(productData);
          setIsWishlisted(true);
          toast.success("Added to wishlist");
        }
      } else {
        // Guest user - use local storage
        if (isWishlisted) {
          removeFromGuestWishlist(productId);
          setIsWishlisted(false);
          toast.success("Removed from wishlist");
        } else {
          addToGuestWishlist(productData);
          setIsWishlisted(true);
          toast.success("Added to wishlist");
        }
      }
      
      // Notify parent component
      if (onWishlistChange) {
        onWishlistChange(productId, !isWishlisted);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Failed to update wishlist");
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    
    try {
      const productId = product.id || product._id;
      const productData = {
        productId: productId,
        quantity: 1,
        price: product.price,
        title: product.name || product.title,
        image: primaryImg,
      };
      
      if (localStorage.getItem("token")) {
        // Logged in user - use API
        console.log('Adding to cart:', { product, productId });
        await cartApi.addToCart(productData);
        toast.success("Added to cart");
      } else {
        // Guest user - use local storage
        addToGuestCart(productData);
        toast.success("Added to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // ---- LIST VIEW ----
  if (viewMode === "list") {
    return (
      <article
        className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleProductClick}
      >
        <div className="flex-shrink-0">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 border border-gray-200 rounded-md overflow-hidden relative">
            {product.badge && (
              <div className="absolute left-1 top-1 bg-red-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                {product.badge}
              </div>
            )}
            {primaryImg && (
              <img
                src={primaryImg}
                alt={product.title || product.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100"
                loading="lazy"
                title={product.title || product.name}
              />
            )}
            {hoverImg && hoverImg !== primaryImg && (
              <img
                src={hoverImg}
                alt={product.title || product.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 hover:opacity-100"
                loading="lazy"
              />
            )}
            {/* Wishlist Icon */}
            <button
              onClick={handleWishlistClick}
              disabled={isTogglingWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`absolute right-1 top-1 z-20 p-0.5 sm:p-1 rounded-full flex items-center justify-center transition-all duration-300 ${
                isWishlisted ? "bg-red-600" : "bg-white"
              }`}
              style={{ width: 20, height: 20 }}
            >
              {isWishlisted ? (
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="white" viewBox="0 0 24 24" stroke="none">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54z" />
                </svg>
              ) : (
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="black" strokeWidth={2} viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-gray-900 leading-tight mb-1 sm:mb-2 line-clamp-2">
            {product.title || product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="flex items-baseline gap-1 sm:gap-2">
            <div className="font-black text-base sm:text-lg text-gray-900">₹{product.price}</div>
            {product.mrp && product.mrp > product.price && (
              <>
                <div className="line-through text-gray-500 text-sm">₹{product.mrp}</div>
                <div className="text-red-600 font-bold text-sm">
                  {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                </div>
              </>
            )}
          </div>
          <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-3">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </article>
    );
  }

  // ---- GRID VIEW ----
  return (
    <article
      className="group relative bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
      onClick={handleProductClick}
    >
      {/* Promotional Banner */}
      {product.badge && (
        <div className="absolute left-3 top-3 z-20 bg-red-600 text-white text-sm font-extrabold px-3 py-1.5 rounded shadow-lg">
          {product.badge}
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        disabled={isTogglingWishlist}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute right-1.5 sm:right-3 top-1.5 sm:top-3 z-20 p-1 sm:p-2 rounded-full flex items-center justify-center transition-all duration-300 ${
          isWishlisted ? "bg-red-600" : "bg-white"
        }`}
        style={{ width: 24, height: 24 }}
      >
        {isWishlisted ? (
          // White filled heart on red bg
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4"
            fill="white"
            viewBox="0 0 24 24"
            stroke="none"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54z" />
          </svg>
        ) : (
          // Black outlined heart on white bg
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4"
            fill="none"
            stroke="black"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        )}
      </button>

      {/* Product Image */}
      <div className="aspect-square sm:aspect-[3/2] bg-gray-50 overflow-hidden relative group/image">
        {primaryImg ? (
          <img
            src={primaryImg}
            alt={product.name || product.title}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            title={product.name || product.title}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
      </div>

      {/* Product Details */}
      <div className="p-2 sm:p-4 flex flex-col flex-1">

        {/* Product Title */}
        <h3 className="font-semibold text-[11px] sm:text-sm text-gray-700 leading-tight mb-1.5 sm:mb-3 line-clamp-2 group-hover:text-gray-900 transition-colors">
          {product.title || product.name}
        </h3>

        {/* Product Description */}
        {product.description && (
          <p className="text-[10px] sm:text-xs text-gray-500 mb-2 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Pricing Section */}
        <div className="flex items-baseline gap-1.5 sm:gap-3 mb-2 sm:mb-4 flex-1">
          <div className="font-black text-sm sm:text-xl text-gray-900">₹{product.price}</div>
          {product.mrp && product.mrp > product.price && (
            <>
              <div className="line-through text-gray-500 text-[10px] sm:text-sm">₹{product.mrp}</div>
              <div className="text-red-600 font-bold text-[10px] sm:text-sm">
                {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
              </div>
            </>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full py-2 sm:py-3 bg-gray-900 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-[1.02] disabled:bg-gray-600 disabled:cursor-not-allowed mt-auto"
        >
          {isAddingToCart ? "ADDING..." : "ADD TO CART"}
        </button>
      </div>
    </article>
  );
}
