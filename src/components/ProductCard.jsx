import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { cartApi, wishlistApi } from "../services/api";
import { toast } from "react-toastify";

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

  // Normalize images
  const images = useMemo(() => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images
        .map((img) =>
          typeof img === "string" ? { url: img, alt: product.name || product.title } : { url: img?.url, alt: img?.alt || product.name || product.title }
        )
        .filter((i) => i.url);
    }
    return product?.image ? [{ url: product.image, alt: product.name || product.title }] : [];
  }, [product]);
  const primaryImg = images[0]?.url || product?.image || null;
  const hoverImg = images[1]?.url || images[0]?.url || product?.image || null;

  // Extract variant data for display
  const variant = product?.variants?.[0] || {};
  const displaySize = variant.size || product?.size;
  const displayColor = variant.color || product?.color;
  const displayThickness = product?.thickness;

  // Update wishlist status when props change
  useEffect(() => {
    setIsWishlisted(wishlistStatus);
  }, [wishlistStatus]);

  // Only check wishlist status if not provided via props
  useEffect(() => {
    if (onWishlistChange) {
      // Parent is managing wishlist status, no need to check individually
      return;
    }
    
    const checkWishlistStatus = async () => {
      try {
        if (localStorage.getItem("token")) {
          // Debounce the wishlist check to prevent multiple calls
          const timeoutId = setTimeout(async () => {
            try {
              const res = await wishlistApi.checkWishlistItem(product.id || product._id);
              setIsWishlisted(!!res?.inWishlist);
            } catch (e) {
              console.error("Error checking wishlist status:", e);
              setIsWishlisted(false);
            }
          }, 100); // 100ms debounce
          
          return () => clearTimeout(timeoutId);
        } else {
          setIsWishlisted(false);
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
      "Area Rugs": "area-rugs"
    };
    
    return categoryMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-');
  };

  const handleProductClick = () => {
    const catFromPath = window.location.pathname.split("/")[1] || "cotton-yoga-mats";
    const category = forcedCategory || categoryToUrl(product?.category) || catFromPath;
    navigate(`/${category}/${product.id || product._id}`);
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    if (!localStorage.getItem("token")) {
      toast.info("Please login to add items to your wishlist");
      return;
    }
    setIsTogglingWishlist(true);
    try {
      if (isWishlisted) {
        await wishlistApi.removeFromWishlist(product.id || product._id);
        setIsWishlisted(false);
        // Notify parent component
        if (onWishlistChange) {
          onWishlistChange(product.id || product._id, false);
        }
        toast.success("Removed from wishlist");
      } else {
        await wishlistApi.addToWishlist({
          productId: product.id || product._id,
          title: product.name || product.title,
          price: product.price,
          image: primaryImg,
        });
        setIsWishlisted(true);
        // Notify parent component
        if (onWishlistChange) {
          onWishlistChange(product.id || product._id, true);
        }
        toast.success("Added to wishlist");
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
    if (!localStorage.getItem("token")) {
      toast.info("Please login to add items to your cart");
      return;
    }
    setIsAddingToCart(true);
    try {
      const productId = product.id || product._id;
      console.log('Adding to cart:', { product, productId });
      await cartApi.addToCart({
        productId: productId,
        quantity: 1,
        price: product.price,
        title: product.name || product.title,
        image: primaryImg,
      });
      toast.success("Added to cart");
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
        className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleProductClick}
      >
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gray-100 border border-gray-200 rounded-md overflow-hidden relative">
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
              className={`absolute right-1 top-1 z-20 p-1 rounded-full flex items-center justify-center transition-all duration-300 ${
                isWishlisted ? "bg-red-600" : "bg-white"
              }`}
              style={{ width: 24, height: 24 }}
            >
              {isWishlisted ? (
                <svg className="w-3 h-3" fill="white" viewBox="0 0 24 24" stroke="none">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54z" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="black" strokeWidth={2} viewBox="0 0 24 24">
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
          <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-tight mb-2 line-clamp-2">
            {product.title || product.name}
          </h3>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
            {product.category && <span className="px-2 py-1 bg-gray-100 rounded-full">{product.category}</span>}
            {displaySize && <span className="px-2 py-1 bg-gray-100 rounded-full">{displaySize}</span>}
            {displayColor && <span className="px-2 py-1 bg-gray-100 rounded-full">{displayColor}</span>}
            {displayThickness && <span className="px-2 py-1 bg-gray-100 rounded-full">{displayThickness}</span>}
          </div>
          <div className="flex items-baseline gap-2">
            <div className="font-black text-lg text-gray-900">₹{product.price}</div>
            {product.mrp && product.mrp > product.price && (
              <>
                <div className="line-through text-gray-500 text-sm">₹{product.mrp}</div>
                <div className="text-red-600 font-bold text-sm">
                  {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
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
      className="group relative bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Promotional Banner */}
      {product.badge && (
        <div className="absolute left-3 top-3 z-20 bg-red-600 text-white text-xs font-extrabold px-3 py-1.5 rounded shadow-lg">
          {product.badge}
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        disabled={isTogglingWishlist}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute right-3 top-3 z-20 p-2 rounded-full flex items-center justify-center transition-all duration-300 ${
          isWishlisted ? "bg-red-600" : "bg-white"
        }`}
        style={{ width: 36, height: 36 }}
      >
        {isWishlisted ? (
          // White filled heart on red bg
          <svg
            className="w-5 h-5"
            fill="white"
            viewBox="0 0 24 24"
            stroke="none"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54z" />
          </svg>
        ) : (
          // Black outlined heart on white bg
          <svg
            className="w-5 h-5"
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
      <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
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
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Product Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {product.category && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
              {product.category}
            </span>
          )}
          {displaySize && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
              {displaySize}
            </span>
          )}
          {displayColor && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
              {displayColor}
            </span>
          )}
          {displayThickness && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
              {displayThickness}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-semibold text-sm text-gray-700 leading-tight mb-3 line-clamp-2 group-hover:text-gray-900 transition-colors">
          {product.title || product.name}
        </h3>

        {/* Pricing Section */}
        <div className="flex items-baseline gap-3 mb-4">
          <div className="font-black text-xl text-gray-900">₹{product.price}</div>
          {product.mrp && product.mrp > product.price && (
            <>
              <div className="line-through text-gray-500 text-sm">₹{product.mrp}</div>
              <div className="text-red-600 font-bold text-sm">
                {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
              </div>
            </>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full py-3 bg-gray-900 text-white text-sm font-semibold rounded-md hover:bg-gray-800 transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-[1.02] disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isAddingToCart ? "ADDING..." : "ADD TO CART"}
        </button>
      </div>
    </article>
  );
}
