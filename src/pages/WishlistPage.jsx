import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { wishlistApi, cartApi } from "../services/api";
import { toast } from "react-toastify";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  // Fetch wishlist data
  useEffect(() => {
    // Prevent duplicate API calls
    if (dataFetched) return;
    
    const fetchWishlist = async () => {
      if (!localStorage.getItem('token')) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await wishlistApi.getWishlist();
        // Fix: Use response.data instead of response
        setWishlist(response.data);
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

  // Handle remove from wishlist
  const handleRemoveItem = async (productId) => {
    try {
      setProcessing(true);
      await wishlistApi.removeFromWishlist(productId);
      
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
      await cartApi.addToCart({
        productId: item.product,
        quantity: 1,
        price: item.price,
        title: item.title,
        image: item.image
      });
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
      // First add to cart
      await cartApi.addToCart({
        productId: item.product,
        quantity: 1,
        price: item.price,
        title: item.title,
        image: item.image
      });
      
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
  const handleClearWishlist = async () => {
    if (!window.confirm('Are you sure you want to clear your wishlist?')) return;
    
    try {
      setProcessing(true);
      await wishlistApi.clearWishlist();
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
      <div className="bg-white flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-sm text-gray-500">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!localStorage.getItem('token')) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-semibold text-center my-8">YOUR WISHLIST</h1>
          <div className="flex flex-col items-center justify-center py-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="red">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-sm text-gray-500 mb-2">Please login to view your wishlist</p>
            <p className="text-sm text-gray-500 mb-6">Your wishlist is empty</p>
            <Link to="/cotton-yoga-mats" className="text-sm font-semibold text-black underline">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty wishlist
  if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Your Wishlist</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8">Items you've saved for later</p>
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-gray-600 mb-6">Start adding items you love to your wishlist</p>
            <Link 
              to="/cotton-yoga-mats" 
              className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-sm hover:shadow-md"
            >
              Start Shopping
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Your Wishlist</h1>
          <p className="text-sm sm:text-base text-gray-600">Items you've saved for later</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {wishlist.items.map((item) => (
            <div key={item.product} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {/* Product Image */}
              <Link to={`/product/${item.product}`} className="block">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 sm:h-48 md:h-52 lg:h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 sm:h-48 md:h-52 lg:h-44 flex items-center justify-center text-gray-400 bg-gray-100">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </Link>
              
              {/* Product Details */}
              <div className="p-4">
                <Link to={`/product/${item.product}`} className="block">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 hover:text-teal-600 transition-colors line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-lg sm:text-xl font-bold text-gray-900 mb-3">₹{item.price}</p>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={processing}
                      className="flex-1 bg-teal-600 text-white py-2 px-3 rounded-md text-sm font-semibold hover:bg-teal-700 transition-colors disabled:bg-teal-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(item)}
                      disabled={processing}
                      className="flex-1 bg-orange-500 text-white py-2 px-3 rounded-md text-sm font-semibold hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                      Buy Now
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.product)}
                    disabled={processing}
                    className="w-full p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:cursor-not-allowed text-sm font-medium"
                    title="Remove from wishlist"
                  >
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 sm:mt-8 text-center">
          <button 
            onClick={handleClearWishlist}
            disabled={processing}
            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:text-red-300 disabled:cursor-not-allowed"
          >
            Clear Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}