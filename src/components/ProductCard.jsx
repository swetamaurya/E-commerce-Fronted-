import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { cartApi, wishlistApi } from "../services/api";
import { toast } from "react-toastify";

export default function ProductCard({ product, viewMode = "grid", category: forcedCategory }) {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  // Normalize images: prefer product.images (string[] or {url,alt}[]), fallback to product.image
  const images = useMemo(() => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images
        .map((img) =>
          typeof img === "string" ? { url: img, alt: product.title } : { url: img?.url, alt: img?.alt || product.title }
        )
        .filter((i) => i.url);
    }
    return product?.image ? [{ url: product.image, alt: product.title }] : [];
  }, [product]);

  const primaryImg = images[0]?.url || product?.image || "";
  const hoverImg = images[1]?.url || images[0]?.url || product?.image || "";

  // Check wishlist status on mount / product change
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        if (localStorage.getItem("token")) {
          const res = await wishlistApi.checkWishlistItem(product.id);
          setIsWishlisted(!!res?.inWishlist);
        } else {
          setIsWishlisted(false);
        }
      } catch (e) {
        console.error("Error checking wishlist status:", e);
      }
    };
    checkWishlistStatus();
  }, [product.id]);

  const handleProductClick = () => {
    const catFromPath = window.location.pathname.split("/")[1] || "cotton-yoga-mats";
    const category = forcedCategory || product?.category || catFromPath;
    navigate(`/${category}/${product.id}`);
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
        await wishlistApi.removeFromWishlist(product.id);
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await wishlistApi.addToWishlist({
          productId: product.id,
          title: product.title,
          price: product.price,
          image: primaryImg,
        });
        setIsWishlisted(true);
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
      await cartApi.addToCart({
        productId: product.id,
        quantity: 1,
        price: product.price,
        title: product.title,
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

  /* ---------- LIST VIEW ---------- */
  if (viewMode === "list") {
    return (
      <article
        className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleProductClick}
      >
        {/* Image with hover swap */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gray-100 border border-gray-200 rounded-md overflow-hidden relative">
            {product.badge && (
              <div className="absolute left-1 top-1 bg-red-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                {product.badge}
              </div>
            )}
            {/* base image */}
            <img
              src={primaryImg}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100"
              loading="lazy"
              title={product.title}
            />
            {/* hover image */}
            <img
              src={hoverImg}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 hover:opacity-100"
              loading="lazy"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-tight mb-2 line-clamp-2">
            {product.title}
          </h3>

          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
            {product.type && <span className="px-2 py-1 bg-gray-100 rounded-full">{product.type}</span>}
            {product.size && <span className="px-2 py-1 bg-gray-100 rounded-full">{product.size}</span>}
            {product.color && <span className="px-2 py-1 bg-gray-100 rounded-full">{product.color}</span>}
          </div>

          <div className="flex items-baseline gap-2">
            <div className="font-black text-lg text-gray-900">₹{product.price}</div>
            {product.mrp && <div className="line-through text-gray-500 text-sm">₹{product.mrp}</div>}
            {product.off && <div className="text-red-600 font-bold text-sm">{product.off} OFF</div>}
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="px-4 py-2 bg-teal-500 text-white text-sm rounded-md hover:bg-teal-600 transition-colors disabled:bg-teal-300 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
            <button
              onClick={handleWishlistClick}
              disabled={isTogglingWishlist}
              className={`p-2 rounded-md border transition-colors ${
                isWishlisted ? "bg-red-50 border-red-200 text-red-600" : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </article>
    );
  }

  /* ---------- GRID VIEW ---------- */
  return (
    <article
      className="group relative bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute left-3 top-3 z-20 bg-red-600 text-white text-xs font-extrabold px-3 py-1.5 rounded shadow-lg">
          {product.badge}
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={handleWishlistClick}
        className={`absolute right-3 top-3 z-20 p-2 rounded-full transition-all duration-300 ${
          isWishlisted
            ? "bg-red-500 text-white shadow-lg scale-110"
            : "bg-white/95 text-gray-600 hover:bg-white hover:shadow-md hover:scale-110"
        }`}
        aria-label="Toggle wishlist"
      >
        <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Image with hover swap */}
  {/* Product Image with Zoom Effect */}
<div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
  <img
    src={primaryImg}
    alt={product.title}
    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
    loading="lazy"
    title={product.title}
  />
</div>

      {/* Info */}
      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-3">
          {product.type && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">{product.type}</span>
          )}
          {product.size && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">{product.size}</span>
          )}
        </div>

        <h3 className="font-semibold text-sm text-gray-700 leading-tight mb-3 line-clamp-2 group-hover:text-gray-900 transition-colors">
          {product.title}
        </h3>

        <div className="flex items-baseline gap-3 mb-4">
          <div className="font-black text-xl text-gray-900">₹{product.price}</div>
          {product.mrp && <div className="line-through text-gray-500 text-sm">₹{product.mrp}</div>}
          {product.off && <div className="text-red-600 font-bold text-sm">{product.off} OFF</div>}
        </div>

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

