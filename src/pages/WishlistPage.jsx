import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { wishlistApi, cartApi } from "../services/api";
import { toast } from "react-toastify";
import CustomDialog from "../components/CustomDialog";
import { 
  getGuestWishlist, 
  removeFromGuestWishlist,
  addToGuestCart
} from "../utils/guestStorage";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Fetch wishlist data
  useEffect(() => {
    // Prevent duplicate API calls
    if (dataFetched) return;
    
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        
        if (localStorage.getItem('token')) {
          // Logged in user - fetch from server
          const response = await wishlistApi.getWishlist();
          setWishlist(response.data);
        } else {
          // Guest user - get from local storage
          const guestWishlist = getGuestWishlist();
          setWishlist({
            items: guestWishlist.map(item => ({
              product: item.productId,
              title: item.title,
              price: item.price,
              image: item.image
            }))
          });
        }
        setDataFetched(true);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [dataFetched]);

  // Refresh wishlist when page becomes visible (for guest users)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !localStorage.getItem('token')) {
        // Page became visible and user is guest - refresh wishlist
        const guestWishlist = getGuestWishlist();
        setWishlist({
          items: guestWishlist.map(item => ({
            product: item.productId,
            title: item.title,
            price: item.price,
            image: item.image
          }))
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Handle remove from wishlist
  const handleRemoveItem = async (productId) => {
    try {
      setProcessing(true);
      
      if (localStorage.getItem('token')) {
        // Logged in user - use API
        await wishlistApi.removeFromWishlist(productId);
      } else {
        // Guest user - update local storage
        removeFromGuestWishlist(productId);
      }
      
      // Update local state
      setWishlist(prevWishlist => ({
        ...prevWishlist,
        items: prevWishlist.items.filter(item => item.product !== productId)
      }));
      
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item');
    } finally {
      setProcessing(false);
    }
  };

  // Handle add to cart
  const handleAddToCart = async (item) => {
    try {
      setProcessing(true);
      
      const productData = {
        productId: item.product,
        quantity: 1,
        price: item.price,
        title: item.title,
        image: item.image
      };
      
      if (localStorage.getItem("token")) {
        // Logged in user - use API
        await cartApi.addToCart(productData);
      } else {
        // Guest user - use local storage
        addToGuestCart(productData);
      }
      
      toast.success('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setProcessing(false);
    }
  };

  // Handle direct order (Buy Now)
  const handleBuyNow = async (item) => {
    try {
      setProcessing(true);
      
      const productData = {
        productId: item.product,
        quantity: 1,
        price: item.price,
        title: item.title,
        image: item.image
      };
      
      // First add to cart
      if (localStorage.getItem("token")) {
        // Logged in user - use API
        await cartApi.addToCart(productData);
      } else {
        // Guest user - use local storage
        addToGuestCart(productData);
      }
      
      // Then navigate to checkout
      window.location.href = '/address';
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Failed to process order');
    } finally {
      setProcessing(false);
    }
  };

  // Handle clear wishlist
  const handleClearWishlist = () => {
    setShowClearDialog(true);
  };

  // Confirm clear wishlist
  const confirmClearWishlist = async () => {
    try {
      setProcessing(true);
      setShowClearDialog(false);
      
      if (localStorage.getItem('token')) {
        // Logged in user - use API
        await wishlistApi.clearWishlist();
      } else {
        // Guest user - clear local storage
        localStorage.removeItem('guest_wishlist');
        // Dispatch event to update navbar count
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      }
      
      setWishlist(prev => ({ ...prev, items: [] }));
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white flex items-center justify-center py-10">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-sm text-gray-500">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  // Guest users can now view their wishlist - this check is removed

  // Empty wishlist
  if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="text-center mb-12">
            <h1 className="page-title text-gray-900 mb-3">Your Wishlist</h1>
            <p className="page-subtitle text-gray-600">Items you've saved for later</p>
          </div>

          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-100/40 to-amber-100/30 rounded-full blur-3xl"></div>
              <div className="relative">
                <svg className="w-24 h-24 sm:w-32 sm:h-32 text-rose-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            </div>

            <div className="max-w-md text-center">
              <h2 className="section-title text-gray-900 mb-3">Your wishlist is empty</h2>
              <p className="text-gray-600 text-base sm:text-lg mb-8">
                Start adding items you love to your wishlist. You can add items from any product page and view them here anytime!
              </p>

              <Link
                to="/cotton-yoga-mats"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold text-lg rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Start Shopping
              </Link>
            </div>

            <div className="mt-12 grid sm:grid-cols-3 gap-6 w-full max-w-2xl">
              <div className="text-center p-6 rounded-xl bg-white border border-gray-100">
                <div className="inline-block p-3 rounded-lg bg-teal-100 mb-3">
                  <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Save for Later</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-white border border-gray-100">
                <div className="inline-block p-3 rounded-lg bg-rose-100 mb-3">
                  <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Track Favorites</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-white border border-gray-100">
                <div className="inline-block p-3 rounded-lg bg-amber-100 mb-3">
                  <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Price Drops</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="page-title text-gray-900">Your Wishlist</h1>
            <p className="text-gray-600 text-sm sm:text-base mt-2">{wishlist.items.length} item{wishlist.items.length !== 1 ? 's' : ''} saved</p>
          </div>
          <button
            onClick={handleClearWishlist}
            disabled={processing}
            className="self-start sm:self-auto px-6 py-3 text-rose-600 hover:text-rose-700 border-2 border-rose-200 hover:bg-rose-50 rounded-lg font-semibold transition-all disabled:text-rose-300 disabled:cursor-not-allowed disabled:border-rose-100"
          >
            Clear Wishlist
          </button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {wishlist.items.map((item) => (
            <div key={item.product} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
              {/* Product Image Container */}
              <Link to={`/product/${item.product}`} className="block relative bg-gray-100 overflow-hidden h-28 sm:h-36 lg:h-40 flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-50">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {/* Heart Badge */}
                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              </Link>

              {/* Product Details */}
              <div className="p-2 sm:p-3 flex flex-col flex-grow">
                <Link to={`/product/${item.product}`} className="block mb-2 flex-grow">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 hover:text-gray-900 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                  <p className="text-sm sm:text-base font-bold text-gray-900">₹{item.price.toLocaleString('en-IN')}</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-1.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={processing}
                      className="bg-gray-900 text-white py-1.5 px-2 rounded text-[10px] sm:text-xs font-bold hover:bg-gray-800 hover:shadow-md transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-0.5"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Add</span>
                    </button>
                    <button
                      onClick={() => handleBuyNow(item)}
                      disabled={processing}
                      className="bg-gray-900 text-white py-1.5 px-2 rounded text-[10px] sm:text-xs font-bold hover:bg-gray-800 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-0.5"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Buy</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.product)}
                    disabled={processing}
                    className="w-full py-1.5 text-[10px] sm:text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded transition-all disabled:cursor-not-allowed font-semibold border border-rose-200 hover:border-rose-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Custom Clear Wishlist Dialog */}
      <CustomDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        title="Clear Wishlist"
        message="Are you sure you want to clear your wishlist? This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        onConfirm={confirmClearWishlist}
        variant="danger"
        showCancel={true}
      />
    </div>
  );
}
