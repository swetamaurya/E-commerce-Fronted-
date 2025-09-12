import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartApi } from "../services/api";
import { toast } from "react-toastify";

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
      if (!localStorage.getItem("token")) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await cartApi.getCart();
        console.log('Cart data received:', response.data);
        console.log('Cart items:', response.data?.items);
        setCart(response.data);
        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load cart");
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
      console.log('Updating cart item:', { productId, newQuantity });
      
      // Backend likely uses productId + userId to update quantity
      await cartApi.updateCartItem(productId, { quantity: newQuantity });

      setCart((prevCart) => {
        const updatedItems = prevCart.items.map((item) => {
          const itemId = item.product || item.productId;
          return itemId === productId ? { ...item, quantity: newQuantity } : item;
        });

        const newTotal = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        console.log('Cart updated locally:', {
          itemsCount: updatedItems.length,
          newTotal: newTotal,
          items: updatedItems.map(item => ({
            productName: item.title,
            quantity: item.quantity,
            price: item.price,
            total: item.quantity * item.price
          }))
        });

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
      console.log('Removing cart item:', { productId, type: typeof productId });
      
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
      
      await cartApi.removeFromCart(productId);

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
      <div className="bg-white flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!localStorage.getItem("token")) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">Your Bag</h1>
          <div className="flex flex-col items-center justify-center py-20">
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
            <p className="text-sm text-gray-500 mb-2">Please login to view your cart</p>
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

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">Your Bag</h1>
          <div className="flex flex-col items-center justify-center py-20">
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
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 text-center">Your Bag</h1>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
                  <h2 className="text-lg sm:text-xl font-medium">Shopping Cart ({cart.items.length} items)</h2>
                  <button
                    onClick={handleClearCart}
                    disabled={updating}
                    className="text-sm text-red-600 hover:text-red-800 disabled:text-red-300 disabled:cursor-not-allowed px-3 py-1 hover:bg-red-50 rounded transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="divide-y divide-gray-200">
                  {cart.items.map((item, index) => (
                    <div key={item.product || item.productId || index} className="py-4 sm:py-6 flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-full sm:w-24 h-32 sm:h-24 border border-gray-200 rounded-md overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="mb-3 sm:mb-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900">
                              <Link to={`/product/${item.product || item.productId}`} className="hover:text-teal-600">
                                {item.title}
                              </Link>
                            </h3>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">₹{item.price}</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-gray-300 rounded-md w-fit">
                            <button
                              onClick={() => handleQuantityChange(item.product || item.productId, item.quantity - 1)}
                              disabled={updating || item.quantity <= 1}
                              className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 min-w-[2rem] text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.product || item.productId, item.quantity + 1)}
                              disabled={updating}
                              className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => {
                              const productId = item.product || item.productId;
                              console.log('Remove button clicked:', { item, productId });
                              handleRemoveItem(productId);
                            }}
                            disabled={updating}
                            className="font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded transition-colors disabled:text-red-300 disabled:cursor-not-allowed w-fit"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-20">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-medium text-gray-900 mb-4 sm:mb-6">Order Summary</h2>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between">
                    <p className="text-gray-600 text-sm sm:text-base">Subtotal</p>
                    <p className="font-medium text-sm sm:text-base">₹{cart.total}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600 text-sm sm:text-base">Shipping</p>
                    <p className="font-medium text-sm sm:text-base">Free</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3 sm:pt-4 flex justify-between">
                    <p className="text-base sm:text-lg font-medium">Total</p>
                    <p className="text-base sm:text-lg font-bold">₹{cart.total}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/address", { state: { fromCart: true } })}
                  className="mt-4 sm:mt-6 w-full bg-teal-600 text-white py-2.5 sm:py-3 px-4 rounded-md font-medium hover:bg-teal-700 transition-colors text-sm sm:text-base"
                >
                  Checkout
                </button>

                <div className="mt-4 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-2 sm:space-y-0">
                  <Link
                    to="/cotton-yoga-mats"
                    className="text-sm font-medium text-teal-600 hover:text-teal-500 text-center"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
