// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { listProducts } from "../../products";
import { cartApi, wishlistApi } from "../services/api";
import { toast } from "react-toastify";
import SEO from "../components/SEO";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // gallery
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoom, setZoom] = useState({ x: 50, y: 50, active: false });

  // purchase state
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("2 X 6 Feet | 8 Mm"); // UI only
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  // info table expand
  const [showFullInfo, setShowFullInfo] = useState(false);

  // category from URL
  const category = location.pathname.split("/")[1];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const products = await listProducts(category);
        const found = products.find((p) => p.id === productId);
        if (!found) return navigate("/not-found");

        setProduct(found);

        if (localStorage.getItem("token")) {
          try {
            const res = await wishlistApi.checkWishlistItem(productId);
            setIsWishlisted(res.inWishlist);
          } catch (e) {
            console.error("wishlist status:", e);
          }
        }
      } catch (e) {
        console.error(e);
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };

    if (category && productId) fetchProduct();
  }, [category, productId, navigate]);

  // --------- API handlers (UNCHANGED SIGNATURES) ----------
  const handleAddToCart = async () => {
    if (!localStorage.getItem("token")) {
      toast.info("Please login to add items to your cart");
      return;
    }
    setIsAddingToCart(true);
    try {
      await cartApi.addToCart({
        productId: product.id,
        quantity,
        price: product.price,
        title: product.title,
        image: product.image,
      });
      toast.success("Added to cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleWishlist = async () => {
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
          image: product.image,
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

  // demo gallery (repeat same image if no array provided)
  const gallery = product.images?.length
    ? product.images
    : [product.image, product.image, product.image, product.image, product.image];

  // specs demo (fill from product when available)
  const specs = [
    ["Brand", "Royal Thread"],
    ["Type", product.type || "—"],
    ["Material", "Cotton"],
    ["Pack Of", "1"],
    ["Color", product.color || "Fade-Resistant And Maintains Color Over Time"],
    ["Size", product.size || selectedSize],
    ["SKU", product.id],
  ];

  const onZoomMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ x, y, active: true });
  };

  return (
    <>
      <SEO
        title={`${product.title} - Royal Thread`}
        description={product.title}
        keywords={`${product.type}, ${product.color}, ${product.size}, handmade`}
        image={gallery[0]}
        type="product"
        canonical={`https://royalthread.co.in/${category}/${product.id}`}
      />

      <div className="min-h-screen bg-white py-6">
        <div className="max-w-[1200px] mx-auto px-4">
          {/* breadcrumb */}
          <nav className="flex mb-6 text-sm">
            <button
              onClick={() => navigate(`/${category}`)}
              className="text-gray-500 hover:text-gray-700"
            >
              {category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
            <span className="px-2 text-gray-400">/</span>
            <span className="text-gray-900">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: Gallery */}
            <div className="grid grid-cols-[88px,1fr] gap-4">
              {/* thumbs */}
              <div className="flex lg:flex-col gap-3 order-2 lg:order-1">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded border overflow-hidden hover:opacity-90 ${
                      selectedImage === i ? "border-teal-500" : "border-gray-200"
                    }`}
                  >
                    <img src={src} className="w-full h-full object-cover" alt={`thumb-${i}`} />
                  </button>
                ))}
              </div>

              {/* main image with hover zoom like Flipkart */}
              <div
                className="relative order-1 lg:order-2 rounded border border-gray-200 overflow-hidden bg-gray-50"
                onMouseMove={onZoomMove}
                onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
              >
                <img
                  src={gallery[selectedImage]}
                  alt={product.title}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    zoom.active ? "scale-110" : "scale-100"
                  }`}
                  style={
                    zoom.active
                      ? { transformOrigin: `${zoom.x}% ${zoom.y}%` }
                      : undefined
                  }
                />
              </div>
            </div>

            {/* RIGHT: Details */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 leading-snug">
                {product.title}
              </h1>

              {/* price row */}
              <div className="mt-3 flex items-center gap-3">
                <div className="text-3xl font-bold text-gray-900">₹{product.price}</div>
                {product.mrp && (
                  <div className="text-gray-500 line-through text-lg">₹{product.mrp}</div>
                )}
                {product.off && (
                  <div className="text-red-600 font-semibold">{product.off} Off</div>
                )}
              </div>

              {/* promo banner */}
              <div className="mt-4 rounded border border-teal-100 bg-teal-50 text-teal-900 px-3 py-2 flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-teal-600 text-white text-xs">
                  ₹
                </span>
                <span className="text-sm">Get this as low as <b>₹{Math.max(0, product.price - 79)}</b></span>
              </div>

              {/* delivery / return strip */}
              <div className="mt-4 grid grid-cols-3 gap-3 text-center border rounded">
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

              {/* CTA row */}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="flex-1 bg-gray-900 text-white py-3 rounded-md font-semibold hover:bg-gray-800 disabled:bg-gray-600"
                >
                  {isAddingToCart ? "ADDING..." : "ADD TO BAG"}
                </button>
                <button className="flex-1 bg-black text-white py-3 rounded-md font-semibold hover:opacity-90">
                  BUY NOW
                </button>
              </div>

              {/* size (UI only) */}
              <div className="mt-6">
                <div className="text-base font-semibold mb-2">Size</div>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-64 border rounded px-3 py-2"
                >
                  <option>2 X 6 Feet | 8 Mm</option>
                  <option>2 X 6 Feet | 7 Mm</option>
                  <option>2 X 6 Feet | 6 Mm</option>
                  <option>2 X 6 Feet | 5 Mm</option>
                </select>
              </div>

              {/* quantity + wishlist */}
              <div className="mt-4 flex items-center gap-4">
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

                <button
                  onClick={toggleWishlist}
                  disabled={isTogglingWishlist}
                  className={`mt-6 px-4 py-2 rounded border ${
                    isWishlisted
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {isWishlisted ? "♥ Wishlisted" : "♡ Add to Wishlist"}
                </button>
              </div>

              {/* product information table */}
              <div className="mt-8 border rounded">
                <div className="px-4 py-3 border-b font-semibold">Product Information</div>
                <div className="p-0">
                  <table className="w-full text-sm">
                    <tbody>
                      {(showFullInfo ? specs : specs.slice(0, 5)).map(([k, v]) => (
                        <tr key={k} className="border-b last:border-b-0">
                          <td className="w-40 px-4 py-3 text-gray-600">{k}</td>
                          <td className="px-4 py-3">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 text-right">
                  <button
                    className="text-sm font-semibold underline underline-offset-2"
                    onClick={() => setShowFullInfo((s) => !s)}
                  >
                    {showFullInfo ? "READ LESS" : "READ MORE"}
                  </button>
                </div>
              </div>

              {/* description */}
              <div className="mt-6">
                <div className="text-base font-semibold mb-2">Product Description</div>
                <p className="text-gray-700 leading-relaxed">
                  This premium {product.type?.toLowerCase() || "product"} is handcrafted
                  with the finest materials, featuring a beautiful{" "}
                  {product.color?.toLowerCase() || "elegant"} design. Perfect for daily use,
                  combining traditional craftsmanship with modern aesthetics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
