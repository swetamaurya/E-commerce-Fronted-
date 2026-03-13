import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartApi } from "../services/api";
import { toast } from "react-toastify";
import { 
  getGuestCart, 
  updateGuestCartQuantity, 
  removeFromGuestCart, 
  clearGuestCart 
} from "../utils/guestStorage";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  // Fetch cart data
  useEffect(() => {
    if (dataFetched) return;

    const fetchCart = async () => {
      try {
        setLoading(true);

        if (localStorage.getItem("token")) {
          // Logged in user - fetch from server
          const response = await cartApi.getCart();
          setCart(response.data);
        } else {
          // Guest user - get from local storage
          const guestCart = getGuestCart();
          const total = guestCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          setCart({
            items: guestCart,
            totalItems: guestCart.reduce((sum, item) => sum + item.quantity, 0),
            total: total,
            totalAmount: total
          });
        }
        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load cart");
        setDataFetched(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [dataFetched]);

  // Update quantity handler
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(true);
      
      if (localStorage.getItem("token")) {
        // Logged in user - use API
        await cartApi.updateCartItem(productId, { quantity: newQuantity });
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        // Guest user - update local storage
        updateGuestCartQuantity(productId, newQuantity);
      }

      setCart((prevCart) => {
        const updatedItems = prevCart.items.map((item) => {
          const itemId = item.product || item.productId;
          return itemId === productId ? { ...item, quantity: newQuantity } : item;
        });

        const newTotal = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return { ...prevCart, items: updatedItems, total: newTotal };
      });

      toast.success("Cart updated");
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    } finally {
      setUpdating(false);
    }
  };

  // Remove single item handler
  const handleRemoveItem = async (productId) => {
    try {
      setUpdating(true);
      
      // Check if we're in the middle of checkout
      const currentPath = window.location.pathname;
      if (currentPath !== "/cart") {
        toast.error("Cannot remove items during checkout");
        return;
      }
      
      // Check if productId is valid
      if (!productId || productId === '_id' || productId === 'undefined') {
        console.error("Error: Invalid product ID:", productId);
        toast.error("Cannot remove item: Invalid product ID");
        setUpdating(false);
        return;
      }
      
      if (localStorage.getItem("token")) {
        // Logged in user - use API
        await cartApi.removeFromCart(productId);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        // Guest user - update local storage
        removeFromGuestCart(productId);
      }

      setCart((prevCart) => {
        if (!prevCart || !prevCart.items) {
          return prevCart;
        }
        
        const updatedItems = prevCart.items.filter((item) => {
          // Check both productId and product fields to ensure compatibility
          const itemId = item.productId || item.product?._id || item.product;
          return itemId !== productId;
        });

        const newTotal = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return { ...prevCart, items: updatedItems, total: newTotal };
      });

      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item from cart:", error.response?.data || error.message);
      toast.error("Failed to remove item: " + (error.message || "Unknown error"));
    } finally {
      setUpdating(false);
    }
  };

  // Clear entire cart handler
  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    try {
      setUpdating(true);
      await cartApi.clearCart();
      setCart((prev) => ({ ...prev, items: [], total: 0 }));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white flex items-center justify-center py-10">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="page-title text-gray-900 mb-2 text-center">Your Bag</h1>
          <div className="flex flex-col items-center justify-center py-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-sm text-gray-500 mb-6">Your bag is empty</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
              <Link to="/cotton-yoga-mats" className="text-sm font-semibold text-black underline text-center">
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="page-title text-gray-900">Your Bag</h1>
          <p className="page-subtitle text-gray-500 mt-1">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-0">
                {/* Cart Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 border-b border-gray-100 bg-gray-50">
                  <h2 className="section-title text-gray-900">Shopping Bag</h2>
                  <button
                    onClick={handleClearCart}
                    disabled={updating}
                    className="text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 disabled:text-red-300 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-all font-medium mt-3 sm:mt-0"
                  >
                    Clear Cart
                  </button>
                </div>

                {/* Cart Items */}
                <div className="divide-y divide-gray-100">
                  {cart.items.map((item, index) => (
                    <div key={item.product || item.productId || index} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-full sm:w-28 h-36 sm:h-28 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-50">
                              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                              <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
                                <Link to={`/product/${item.product || item.productId}`} className="hover:text-gray-900 transition-colors">
                                  {item.title}
                                </Link>
                              </h3>
                              <p className="text-base sm:text-lg font-bold text-gray-900 flex-shrink-0">₹{item.price.toLocaleString('en-IN')}</p>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')} = <span className="font-semibold text-gray-600">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span></p>
                          </div>

                          {/* Controls */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-gray-200 rounded-lg bg-white w-fit hover:border-teal-300 transition-colors">
                              <button
                                onClick={() => handleQuantityChange(item.product || item.productId, item.quantity - 1)}
                                disabled={updating || item.quantity <= 1}
                                className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-teal-50 disabled:text-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
                              >
                                −
                              </button>
                              <span className="px-3 py-1.5 min-w-[2.25rem] text-center font-semibold text-gray-900 text-sm">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.product || item.productId, item.quantity + 1)}
                                disabled={updating}
                                className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-teal-50 disabled:text-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
                              >
                                +
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => {
                                const productId = item.product || item.productId;
                                handleRemoveItem(productId);
                              }}
                              disabled={updating}
                              className="text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all disabled:text-rose-300 disabled:cursor-not-allowed flex-shrink-0"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24 lg:top-32">
              <div className="p-4 sm:p-5">
                <h2 className="section-title text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-5 pb-5 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 font-medium">Subtotal</p>
                    <p className="text-sm text-gray-900 font-semibold">₹{cart.total.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 font-medium">Shipping</p>
                    <p className="text-sm text-green-600 font-semibold">Free</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 font-medium">Discount</p>
                    <p className="text-sm text-gray-900 font-semibold">₹0</p>
                  </div>
                </div>

                <div className="mb-5 pb-5 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <p className="text-base font-bold text-gray-900">Total</p>
                    <p className="text-xl font-bold text-gray-900">₹{cart.total.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/address", { state: { fromCart: true } })}
                  className="w-full bg-teal-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-teal-700 transition-all"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/cotton-yoga-mats")}
                  className="w-full mt-2.5 border border-teal-600 text-gray-900 py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-teal-50 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Benefits Card */}
            <div className="mt-5 bg-white rounded-xl shadow-sm border border-gray-100 p-5 hidden sm:block">
              <h3 className="section-title text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Why shop with us?
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-gray-900 font-bold">✓</span>
                  <span>Free shipping on all orders</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-900 font-bold">✓</span>
                  <span>Easy returns within 3 days</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-900 font-bold">✓</span>
                  <span>Secure checkout process</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
