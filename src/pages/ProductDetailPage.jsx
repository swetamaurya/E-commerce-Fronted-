// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import productApi from "../services/productApi";
import { cartApi, wishlistApi } from "../services/api";
import { toast } from "react-toastify";
import SEO from "../components/SEO";
import ImageGallery from "../components/ImageGallery";
 

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

        // Check wishlist status only if user is logged in
        if (localStorage.getItem("token")) {
          try {
            const res = await wishlistApi.checkWishlistItem(productId);
            if (isMounted) {
              setIsWishlisted(res.inWishlist);
            }
          } catch (e) {
            if (isMounted) {
              setIsWishlisted(false);
            }
          }
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
    if (!localStorage.getItem("token")) {
      // Show custom login modal
      setShowLoginModal(true);
      return;
    }
    setIsAddingToCart(true);
    try {
      await cartApi.addToCart({
        productId: product.id || product._id,
        quantity,
        price: product.price,
        title: product.name || product.title,
        image: product.images?.[0]?.url || product.image,
      });
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
    if (!localStorage.getItem("token")) {
      // Show custom login modal for wishlist too
      setShowLoginModal(true);
      return;
    }
    setIsTogglingWishlist(true);
    try {
      if (isWishlisted) {
        await wishlistApi.removeFromWishlist(product.id || product._id);
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await wishlistApi.addToWishlist({
          productId: product.id || product._id,
          title: product.name || product.title,
          price: product.price,
          image: product.images?.[0]?.url || product.image,
        });
        setIsWishlisted(true);
        toast.success("Added to wishlist");
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

  // Prepare images for gallery - ensure proper format
  const galleryImages = product.images?.length
    ? product.images.map((img, index) => ({
        url: typeof img === 'string' ? img : img.url,
        alt: typeof img === 'string' ? `${product.name || product.title} - Image ${index + 1}` : img.alt || `${product.name || product.title} - Image ${index + 1}`,
        thumbnail: typeof img === 'string' ? img : img.thumbnail || img.url
      }))
    : product.image
    ? [{ 
        url: product.image, 
        alt: product.name || product.title,
        thumbnail: product.image
      }]
    : [];

  // Debug: Log images data (commented out for production)

  // Extract variant data for display
  const variant = product?.variants?.[0] || {};
  const displaySize = variant.size || product?.size || selectedSize;
  const displayColor = variant.color || product?.color || "Fade-Resistant And Maintains Color Over Time";

  // specs demo (fill from product when available)
  const specs = [
    ["Brand", product.brand || "Royal Thread"],
    ["Type", product.category || "—"],
    ["Material", "Cotton"],
    ["Pack Of", "1"],
    ["Color", displayColor],
    ["Size", displaySize],
    ["SKU", product.id || product._id],
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

             <div className="bg-white py-2">
         <div className="max-w-[1200px] mx-auto px-3">
          {/* breadcrumb */}
          <nav className="flex mb-2 text-sm">
            <button
              onClick={() => navigate(`/${category}`)}
              className="text-gray-500 hover:text-gray-700"
            >
              {category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
            <span className="px-2 text-gray-400">/</span>
            <span className="text-gray-900">{product.name || product.title}</span>
          </nav>

                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mb-0">
          {/* LEFT: Image Gallery - Sticky */}
          <div className="relative lg:sticky lg:top-4 lg:self-start mb-0">
               {/* Wishlist Icon - Top Right */}
               <button
                 onClick={toggleWishlist}
                 disabled={isTogglingWishlist}
                 className={`absolute top-2 right-2 z-20 p-2 rounded-full flex items-center justify-center transition-all duration-300 ${
                   isWishlisted ? "bg-red-600" : "bg-white"
                 }`}
                 style={{ width: 40, height: 40 }}
               >
                 {isWishlisted ? (
                   // White filled heart on red bg
                   <svg
                     className="w-6 h-6"
                     fill="white"
                     viewBox="0 0 24 24"
                     stroke="none"
                   >
                     <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54z" />
                   </svg>
                 ) : (
                   // Black outlined heart on white bg
                   <svg
                     className="w-6 h-6"
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
               
               <ImageGallery 
                 images={galleryImages} 
                 productName={product.name || product.title}
               />
               
                           {/* CTA Buttons - Below Image */}
            <div className="mt-2 flex gap-2 mb-0">
                 <button
                   onClick={handleAddToCart}
                   disabled={isAddingToCart}
                   className="flex-1 bg-gray-900 text-white py-2.5 rounded-md font-semibold hover:bg-gray-800 disabled:bg-gray-600 text-sm"
                 >
                   {isAddingToCart ? "ADDING..." : "ADD TO BAG"}
                 </button>
                 <button className="flex-1 bg-black text-white py-2.5 rounded-md font-semibold hover:opacity-90 text-sm">
                   BUY NOW
                 </button>
               </div>
             </div>

                      {/* RIGHT: Details */}
          <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-gray-900 leading-snug">
                {product.name || product.title}
              </h1>

              {/* price row */}
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-gray-900">₹{product.price}</div>
                {product.mrp && (
                  <div className="text-gray-500 line-through text-lg">₹{product.mrp}</div>
                )}
                {product.off && (
                  <div className="text-red-600 font-semibold">{product.off} Off</div>
                )}
              </div>

              {/* promo banner */}
              <div className="rounded border border-teal-100 bg-teal-50 text-teal-900 px-3 py-2 flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-teal-600 text-white text-xs">
                  ₹
                </span>
                <span className="text-sm">Get this as low as <b>₹{Math.max(0, product.price - 79)}</b></span>
              </div>

              {/* delivery / return strip */}
              <div className="grid grid-cols-3 gap-3 text-center border rounded">
                <div className="py-3">
                  <div className="font-semibold">Cash on Delivery</div>
                </div>
                <div className="py-3 border-x">
                  <div className="font-semibold">Easy 3 days return</div>
                </div>
                <div className="py-3">
                  <div className="font-semibold">Free Delivery</div>
                </div>
                <div className="col-span-3 bg-gray-50 py-2 text-sm text-gray-700">
                  Get it delivered in <b>3-7 days</b>
                </div>
              </div>


              {/* size selection */}
              <div>
                <div className="text-base font-semibold mb-2">Size</div>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-64 border rounded px-3 py-2"
                >
                  {product.variants?.map((variant, index) => (
                    <option key={index} value={variant.size}>
                      {variant.size} - ₹{variant.price}
                    </option>
                  )) || (
                    <option value={displaySize}>{displaySize}</option>
                  )}
                </select>
              </div>

              {/* quantity */}
               <div>
                 <div className="text-sm text-gray-600 mb-1">Quantity</div>
                 <div className="flex items-center border rounded w-32">
                   <button
                     onClick={() => handleQuantityChange(quantity - 1)}
                     className="px-3 py-2 text-gray-700 disabled:opacity-40"
                     disabled={quantity <= 1}
                   >
                     –
                   </button>
                   <div className="flex-1 text-center">{quantity}</div>
                   <button
                     onClick={() => handleQuantityChange(quantity + 1)}
                     className="px-3 py-2 text-gray-700"
                   >
                     +
                   </button>
                 </div>
               </div>

              {/* product information table */}
              <div className="border rounded">
                <div className="px-4 py-2 border-b font-semibold">Product Information</div>
                <div className="p-0">
                  <table className="w-full text-sm">
                    <tbody>
                      {(showFullInfo ? specs : specs.slice(0, 5)).map(([k, v]) => (
                        <tr key={k} className="border-b last:border-b-0">
                          <td className="w-40 px-4 py-2 text-gray-600">{k}</td>
                          <td className="px-4 py-2">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-2 text-right">
                  <button
                    className="text-sm font-semibold underline underline-offset-2"
                    onClick={() => setShowFullInfo((s) => !s)}
                  >
                    {showFullInfo ? "READ LESS" : "READ MORE"}
                  </button>
                </div>
              </div>

              {/* description */}
              <div>
                <div className="text-base font-semibold mb-1">Product Description</div>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || `This premium ${product.category?.toLowerCase() || "product"} is handcrafted
                  with the finest materials, featuring a beautiful ${displayColor?.toLowerCase() || "elegant"} design. Perfect for daily use,
                  combining traditional craftsmanship with modern aesthetics.`}
                </p>
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
