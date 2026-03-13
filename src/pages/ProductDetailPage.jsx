// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import productApi from "../services/productApi";
import { cartApi, wishlistApi } from "../services/api";
import { toast } from "react-toastify";
import { 
  addToGuestWishlist, 
  removeFromGuestWishlist, 
  isInGuestWishlist,
  addToGuestCart
} from "../utils/guestStorage";
import SEO from "../components/SEO";
import ImageGallery from "../components/ImageGallery";
import { getImageUrl } from "../utils/imageUtils";
 

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // gallery - now handled by ImageGallery component

  // purchase state
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(""); // Will be set from variant data
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isFromBuyNow, setIsFromBuyNow] = useState(false);
  
  // login modal
  const [showLoginModal, setShowLoginModal] = useState(false);

  // info table expand
  const [showFullInfo, setShowFullInfo] = useState(false);

  // product description expand
  const [showFullDescription, setShowFullDescription] = useState(false);

  // category from URL
  const category = location.pathname.split("/")[1];

  // Set initial size from variant data
  useEffect(() => {
    if (product?.variants?.[0]?.size) {
      setSelectedSize(product.variants[0].size);
    }
  }, [product]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProduct = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      
      try {
        // Try to fetch product directly by ID first (more efficient)
        try {
          const directResponse = await productApi.getProductById(productId);
          if (directResponse.success && directResponse.data) {
            if (isMounted) {
              setProduct(directResponse.data);
            }
          } else {
            throw new Error('Product not found via direct fetch');
          }
        } catch (directError) {
          // Fallback: get products by category only if direct fetch fails
          const response = await productApi.getProductsByCategory(category);
          const products = response.data || [];

          const found = products.find((p) => (p.id || p._id) === productId);
          
          if (!isMounted) return;
          
          if (!found) {
            navigate("/not-found");
            return;
          } else {
            setProduct(found);
          }
        }

        // Check wishlist status for both logged-in and guest users
        try {
          if (localStorage.getItem("token")) {
            const res = await wishlistApi.checkWishlistItem(productId);
            if (isMounted) setIsWishlisted(!!res?.inWishlist);
          } else {
            if (isMounted) setIsWishlisted(isInGuestWishlist(productId));
          }
        } catch (e) {
          if (isMounted) setIsWishlisted(false);
        }
      } catch (e) {
        if (isMounted) {
          navigate("/not-found");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (category && productId) {
      fetchProduct();
    }
    
    return () => {
      isMounted = false;
    };
  }, [category, productId, navigate]);

  // --------- API handlers (UNCHANGED SIGNATURES) ----------
  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const payload = {
        productId: product.id || product._id,
        quantity,
        price: product.price,
        title: product.name || product.title,
        image: product.images?.[0]?.url || product.image,
      };
      if (localStorage.getItem("token")) {
        await cartApi.addToCart(payload);
      } else {
        addToGuestCart(payload);
      }
      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    setIsBuyingNow(true);

    try {
      const payload = {
        productId: product.id || product._id,
        quantity,
        price: product.price,
        title: product.name || product.title,
        image: product.images?.[0]?.url || product.image,
      };

      if (localStorage.getItem("token")) {
        await cartApi.addToCart(payload);
      } else {
        addToGuestCart(payload);
      }

      navigate('/cart');
    } catch {
      toast.error("Failed to proceed to checkout");
    } finally {
      setIsBuyingNow(false);
    }
  };
  
  const handleLoginConfirm = () => {
    setShowLoginModal(false);
    
    if (isFromBuyNow) {
      navigate("/cart");
      setIsFromBuyNow(false); // Reset the flag
    } else {
      // For other cases, redirect to account page
      localStorage.setItem("returnToUrl", window.location.pathname);
      navigate("/account");
    }
  };
  
  const handleLoginCancel = () => {
    setShowLoginModal(false);
    setIsFromBuyNow(false); // Reset the flag when cancelled
  };

  const toggleWishlist = async () => {
    const pid = product?.id || product?._id;
    if (!pid) return;
    setIsTogglingWishlist(true);
    try {
      if (localStorage.getItem("token")) {
        // Server wishlist for logged-in users
        if (isWishlisted) {
          await wishlistApi.removeFromWishlist(pid);
          setIsWishlisted(false);
          toast.success("Removed from wishlist");
        } else {
          await wishlistApi.addToWishlist({
            productId: pid,
            title: product.name || product.title,
            price: product.price,
            image: product.images?.[0]?.url || product.image,
          });
          setIsWishlisted(true);
          toast.success("Added to wishlist");
        }
      } else {
        // Guest wishlist in localStorage
        const productData = {
          productId: pid,
          title: product.name || product.title,
          price: product.price,
          image: product.images?.[0]?.url || product.image,
        };
        if (isWishlisted) {
          removeFromGuestWishlist(pid);
          setIsWishlisted(false);
          toast.success("Removed from wishlist");
        } else {
          addToGuestWishlist(productData);
          setIsWishlisted(true);
          toast.success("Added to wishlist");
        }
      }
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setIsTogglingWishlist(false);
    }
  };
  // --------------------------------------------------------

  const handleQuantityChange = (n) => n >= 1 && setQuantity(n);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }
  if (!product) return null;

  // Prepare images for gallery - ensure proper format and preserve isPrimary
  const galleryImages = product.images?.length
    ? product.images.map((img, index) => ({
        url: getImageUrl(typeof img === 'string' ? img : img.url),
        alt: typeof img === 'string' ? `${product.name || product.title} - Image ${index + 1}` : img.alt || `${product.name || product.title} - Image ${index + 1}`,
        thumbnail: getImageUrl(typeof img === 'string' ? img : img.thumbnail || img.url),
        isPrimary: typeof img === 'string' ? index === 0 : Boolean(img.isPrimary)
      }))
    : product.image
    ? [{ 
        url: getImageUrl(product.image), 
        alt: product.name || product.title,
        thumbnail: getImageUrl(product.image),
        isPrimary: true
      }]
    : [];

  // Sort images to show primary first
  const sortedGalleryImages = galleryImages.sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return 0;
  });

  // Debug: Log images data (commented out for production)

  // Extract variant data for display
  const variant = product?.variants?.[0] || {};
  const displaySize = variant.size || product?.size || (product?.sizes && product.sizes.join(', ')) || selectedSize;
  const displayColor = variant.color || product?.color || (product?.colors && product.colors.join(', ')) || "Fade-Resistant And Maintains Color Over Time";

  // specs demo (fill from product when available)
  const specs = [
    ["Brand", product.brand || "Royal Thread"],
    ["Type", product.category || "—"],
    ["Material", product.meterial || product.material || "Cotton"],
    ["Pack Of", "1"],
    ["Color", displayColor],
    ["Size", displaySize],
    ["SKU", product.sku || "—"],
    ["Special Feature", product.specialFeature || "—"],
  ];

  // Zoom functionality now handled by ImageGallery component

  return (
    <>
      <SEO
        title={`${product.name || product.title} - Royal Thread`}
        description={product.description || product.name || product.title}
        keywords={`${product.category}, ${displayColor}, ${displaySize}, handmade`}
        image={galleryImages[0]?.url || product.image}
        type="product"
        canonical={`https://royalthread.co.in/${category}/${product.id || product._id}`}
      />

      <div className="bg-gray-50 min-h-screen">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4 md:p-5">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {/* LEFT: Image Gallery */}
            <div className="w-full md:w-1/2 md:h-fit">
              <div className="sticky top-20 sm:top-24 self-start">
                <ImageGallery
                  images={sortedGalleryImages}
                  productName={product.name || product.title}
                  onWishlistToggle={toggleWishlist}
                  isWishlisted={isWishlisted}
                />
              </div>
            </div>

            {/* RIGHT: Product Details - Scrollable */}
            <div className="w-full md:w-1/2 space-y-3 sm:space-y-4 md:space-y-5 md:max-h-[calc(100vh-140px)] md:overflow-y-auto md:pr-3 custom-scroll">
              {/* Product Title */}
              <div className="space-y-2 pb-3 border-b border-gray-100">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 leading-snug">
                  {product.name || product.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-green-100">
                    {product.category || "Premium Quality"}
                  </span>
                </div>
              </div>

              {/* Rating Display - Flipkart Style */}
              {(() => {
                const rating = product.rating ? parseFloat(product.rating) : null;
                // const ratingCount = product.rating ? parseInt(product.rating) : 0;
                const reviewsCount = product.reviewsCount ? parseInt(product.reviewsCount) : 0;

                // Only show if rating is a valid number
                if (rating && !isNaN(rating)) {
                  return (
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-1.5 bg-green-600 text-white px-2.5 py-1 rounded-full">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="font-semibold text-xs">{rating.toFixed(1)}</span>
                      </div>
                      <span
                        // onClick={() => navigate(`/ratings/${productId}?from=product`)}
                        className="text-blue-600 text-sm font-medium cursor-pointer hover:underline"
                      >
                        {/* {ratingCount} ratings and {reviewsCount} reviews */}
                                                {reviewsCount} reviews

                      </span>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Price Section */}
              <div className="space-y-2 pb-3 border-b border-gray-100">
                <div className="flex flex-wrap items-baseline gap-3 sm:gap-4">
                  <div className="text-2xl sm:text-3xl font-semibold text-gray-900">₹{product.price}</div>
                  {product.mrp && product.mrp > product.price && (
                    <>
                      <div className="text-base sm:text-lg text-gray-500 line-through">₹{product.mrp}</div>
                      <div className="bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-red-100">
                        {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                      </div>
                    </>
                  )}
                </div>
                
                {product.off && (
                  <div className="text-sm text-red-600 font-semibold">
                    Save ₹{product.mrp - product.price} ({product.off} Off)
                  </div>
                )}
              </div>

              {/* Promo Banner */}
              {/* <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-2 sm:p-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">₹</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Get this as low as <span className="font-bold text-teal-700">₹{Math.max(0, product.price - 79)}</span>
                    </p>
                    <p className="text-xs text-gray-600">With additional offers</p>
                  </div>
                </div>
              </div> */}

              {/* Features Strip */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="text-center p-2 sm:p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white transition-colors">
                  <div className="text-sm sm:text-base font-semibold text-gray-900">Easy Returns</div>
                  <div className="text-xs sm:text-sm text-gray-500">3 days return</div>
                </div>
                <div className="text-center p-2 sm:p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white transition-colors">
                  <div className="text-sm sm:text-base font-semibold text-gray-900">Free Delivery</div>
                  <div className="text-xs sm:text-sm text-gray-500">3-7 days</div>
                </div>
              </div>

              {/* Size and Quantity Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Size Selection - Commented out */}
                {/* <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Select Size</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-gray-900 focus:outline-none transition-colors"
                  >
                    {product.variants?.map((variant, index) => (
                      <option key={index} value={variant.size}>
                        {variant.size} - ₹{variant.price}
                      </option>
                    )) || product.sizes?.map((size, index) => (
                      <option key={index} value={size}>
                        {size}
                      </option>
                    )) || (
                      <option value={displaySize}>{displaySize}</option>
                    )}
                  </select>
                </div> */}

                {/* Color Selection - Commented out */}
                {/* {product.colors && product.colors.length > 1 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">Select Color</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-gray-900 focus:outline-none transition-colors"
                    >
                      {product.colors.map((color, index) => (
                        <option key={index} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>
                )} */}

                {/* Quantity */}
                <div className="mb-1">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Quantity</label>
                  <div className="flex items-center border border-gray-300 rounded-lg w-full bg-white">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg font-light"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <div className="flex-1 text-center py-2 font-medium text-gray-900">{quantity}</div>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors text-lg font-light"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2">
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1 bg-orange-500 text-white py-2.5 rounded-md font-semibold text-sm sm:text-base hover:bg-orange-600 disabled:bg-gray-400 disabled:text-gray-200 transition-all duration-200 shadow-sm"
                  >
                    {isAddingToCart ? "Adding to cart..." : "ADD TO CART"}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={isBuyingNow}
                    className="flex-1 bg-orange-500 text-white py-2.5 rounded-md font-semibold text-sm sm:text-base hover:bg-orange-600 disabled:bg-gray-400 disabled:text-gray-200 transition-all duration-200 shadow-sm"
                  >
                    {isBuyingNow ? "Processing..." : "BUY NOW"}
                  </button>
                </div>

                {/* View Reviews Button */}
                {/* <button
                  onClick={() => navigate(`/ratings/${productId}?from=product`)}
                  className="w-full bg-blue-50 text-blue-700 py-2 rounded-lg font-semibold text-sm hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  📊 View All Reviews
                </button> */}

                {/* Additional Info */}
                <div className="text-center text-xs sm:text-sm text-gray-500">
                  <p>✓ Free shipping on orders above ₹999</p>
                  <p>✓ 3-4 day return policy</p>
                </div>
              </div>

              {/* Product Information */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-4 sm:px-5 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900"  >Product Information</h3>
                </div>
                <div className="p-0">
                  <table className="w-full">
                    <tbody>
                      {(showFullInfo ? specs : specs.slice(0, 5)).map(([k, v]) => (
                        <tr key={k} className="border-b border-gray-200 last:border-b-0">
                          <td className="w-36 px-4 sm:px-5 py-2.5 text-gray-500 font-medium text-xs sm:text-sm">{k}</td>
                          <td className="px-4 sm:px-5 py-2.5 text-gray-900 text-xs sm:text-sm">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 sm:px-5 py-3 text-center border-t border-gray-200 bg-white rounded-b-lg">
                  <button
                    className="text-sm font-semibold text-gray-900 hover:text-teal-700 underline underline-offset-2 transition-colors"
                    onClick={() => setShowFullInfo((s) => !s)}
                  >
                    {showFullInfo ? "READ LESS" : "READ MORE"}
                  </button>
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900"  >Product Description</h3>
                <div className="prose prose-gray max-w-none">
                  <p className={`text-gray-600 leading-relaxed text-base transition-all duration-300 ${showFullDescription ? '' : 'line-clamp-3'}`}>
                    {product.description || `This premium ${product.category?.toLowerCase() || "product"} is handcrafted
                    with the finest materials, featuring a beautiful ${displayColor?.toLowerCase() || "elegant"} design. Perfect for daily use,
                    combining traditional craftsmanship with modern aesthetics.`}
                  </p>
                </div>
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-sm font-semibold text-gray-900 hover:text-teal-700 underline underline-offset-2 transition-colors"
                >
                  {showFullDescription ? "READ LESS" : "READ MORE"}
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Login Required</h3>
              <button 
                onClick={handleLoginCancel} 
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-2">Please login to add items to your cart or wishlist.</p>
              <p className="text-gray-600 mb-4">Would you like to login now?</p>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <button 
                onClick={handleLoginCancel} 
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleLoginConfirm} 
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
