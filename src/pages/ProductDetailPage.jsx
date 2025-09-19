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
  
  // login modal
  const [showLoginModal, setShowLoginModal] = useState(false);

  // info table expand
  const [showFullInfo, setShowFullInfo] = useState(false);

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
        console.log('Fetching product:', { category, productId });
        
        // First try to get products by category
        const response = await productApi.getProductsByCategory(category);
        const products = response.data || [];
        console.log('Products from category:', products);
        
        const found = products.find((p) => (p.id || p._id) === productId);
        console.log('Found product:', found);
        
        if (!isMounted) return;
        
        if (!found) {
          console.log('Product not found in category, trying direct fetch by ID');
          // Try to fetch product directly by ID as fallback
          try {
            const directResponse = await productApi.getProductById(productId);
            if (directResponse.success && directResponse.data) {
              console.log('Found product via direct fetch:', directResponse.data);
              setProduct(directResponse.data);
            } else {
              console.log('Product not found via direct fetch, redirecting to 404');
              navigate("/not-found");
              return;
            }
          } catch (directError) {
            console.log('Direct fetch failed, redirecting to 404:', directError);
            navigate("/not-found");
            return;
          }
        } else {
          setProduct(found);
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
        console.error(`❌ [${Date.now()}] Product fetch error:`, e);
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
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const handleLoginConfirm = () => {
    // Save current page to return after login
    localStorage.setItem("returnToUrl", window.location.pathname);
    setShowLoginModal(false);
    navigate("/account");
  };
  
  const handleLoginCancel = () => {
    setShowLoginModal(false);
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
    } catch (err) {
      console.error("Error toggling wishlist:", err);
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

      <div className="bg-white min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 bg-white">
          {/* Breadcrumb */}
          <nav className="flex items-center mb-4 sm:mb-6 text-sm">
            <button
              onClick={() => navigate(`/${category}`)}
              className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              {category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
            <span className="px-2 text-gray-400 text-sm">/</span>
            <span className="text-gray-900 font-medium text-sm">{product.name || product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* LEFT: Image Gallery - Fixed */}
            <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden lg:z-10">
              <ImageGallery 
                images={sortedGalleryImages} 
                productName={product.name || product.title}
                onWishlistToggle={toggleWishlist}
                isWishlisted={isWishlisted}
              />
            </div>

            {/* RIGHT: Product Details - Scrollable */}
            <div className="space-y-4 sm:space-y-6 lg:overflow-y-auto lg:max-h-screen lg:pr-4 scrollbar-hide lg:relative lg:z-0 lg:pb-20">
              {/* Product Title */}
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-2">
                  {product.name || product.title}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium w-fit">
                    {product.category || "Premium Quality"}
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">₹{product.price}</div>
                  {product.mrp && product.mrp > product.price && (
                    <>
                      <div className="text-sm sm:text-lg text-gray-500 line-through">₹{product.mrp}</div>
                      <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
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
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-2 sm:p-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">₹</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      Get this as low as <span className="font-bold text-teal-700">₹{Math.max(0, product.price - 79)}</span>
                    </p>
                    <p className="text-xs text-gray-600">With additional offers</p>
                  </div>
                </div>
              </div>

              {/* Features Strip */}
              <div className="grid grid-cols-2 gap-1 sm:gap-2">
                <div className="text-center p-2 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="text-sm font-semibold text-gray-900 mb-1">Easy Returns</div>
                  <div className="text-xs text-gray-600">3 days return</div>
                </div>
                <div className="text-center p-2 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="text-sm font-semibold text-gray-900 mb-1">Free Delivery</div>
                  <div className="text-xs text-gray-600">3-7 days</div>
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
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Quantity</label>
                  <div className="flex items-center border border-gray-300 rounded-lg w-full">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
                      disabled={quantity <= 1}
                    >
                      –
                    </button>
                    <div className="flex-1 text-center py-2 font-semibold text-sm">{quantity}</div>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-orange-600 disabled:bg-gray-400 disabled:text-gray-200 transition-all duration-200"
                  >
                    {isAddingToCart ? "Adding to cart..." : "ADD TO CART"}
                  </button>
                  <button className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-orange-600 transition-all duration-200">
                    BUY NOW
                  </button>
                </div>
                
                {/* Additional Info */}
                <div className="text-center text-sm text-gray-600">
                  <p>✓ Free shipping on orders above ₹999</p>
                  <p>✓ 3-4 day return policy</p>
                </div>
              </div>

              {/* Product Information */}
              <div className="bg-gray-50 rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Product Information</h3>
                </div>
                <div className="p-0">
                  <table className="w-full">
                    <tbody>
                      {(showFullInfo ? specs : specs.slice(0, 5)).map(([k, v]) => (
                        <tr key={k} className="border-b border-gray-200 last:border-b-0">
                          <td className="w-40 px-6 py-4 text-gray-600 font-medium">{k}</td>
                          <td className="px-6 py-4 text-gray-900">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 text-center border-t border-gray-200">
                  <button
                    className="text-sm font-semibold text-gray-700 hover:text-gray-900 underline underline-offset-2 transition-colors"
                    onClick={() => setShowFullInfo((s) => !s)}
                  >
                    {showFullInfo ? "READ LESS" : "READ MORE"}
                  </button>
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900">Product Description</h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-base">
                    {product.description || `This premium ${product.category?.toLowerCase() || "product"} is handcrafted
                    with the finest materials, featuring a beautiful ${displayColor?.toLowerCase() || "elegant"} design. Perfect for daily use,
                    combining traditional craftsmanship with modern aesthetics.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Login Required</h3>
              <button onClick={handleLoginCancel} className="modal-close">&times;</button>
            </div>
            <div className="modal-body">
              <p>Please login to add items to your cart or wishlist.</p>
              <p>Would you like to login now?</p>
            </div>
            <div className="modal-footer">
              <button onClick={handleLoginCancel} className="modal-button cancel-button">Cancel</button>
              <button onClick={handleLoginConfirm} className="modal-button confirm-button">Login</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
