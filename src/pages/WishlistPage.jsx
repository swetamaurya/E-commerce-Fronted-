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
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-gray-500">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!localStorage.getItem('token')) {
    return (
      <div className="min-h-[70vh]">
        <div className="max-w-[1100px] mx-auto px-6">
          <h1 className="text-2xl font-semibold text-center my-8">YOUR WISHLIST</h1>
          <div className="flex flex-col items-center justify-center py-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="red">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-gray-500 mb-2">Please login to view your wishlist</p>
            <p className="text-gray-500 mb-6">Your wishlist is empty</p>
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
      <div className="min-h-[70vh]">
        <div className="max-w-[1100px] mx-auto px-6">
          <h1 className="text-2xl font-semibold text-center my-8">YOUR WISHLIST</h1>
          <div className="flex flex-col items-center justify-center py-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="red">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-gray-500 mb-6">Your wishlist is empty</p>
            <Link to="/cotton-yoga-mats" className="text-sm font-semibold text-black underline">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh]">
      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-center mb-8">YOUR WISHLIST</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Saved Items ({wishlist.items.length})</h2>
              <button 
                onClick={handleClearWishlist}
                disabled={processing}
                className="text-sm text-red-600 hover:text-red-800 disabled:text-red-300 disabled:cursor-not-allowed"
              >
                Clear Wishlist
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.items.map((item) => (
                <div key={item.product} className="border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
                  {/* Product Image */}
                  <Link to={`/product/${item.product}`} className="block relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  
                  {/* Product Details */}
                  <div className="p-4">
                    <Link to={`/product/${item.product}`} className="block">
                      <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-teal-600 transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-gray-900 font-bold mb-4">₹{item.price}</p>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={processing}
                        className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-teal-700 transition-colors disabled:bg-teal-300 disabled:cursor-not-allowed"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.product)}
                        disabled={processing}
                        className="p-2 border border-gray-300 rounded-md disabled:cursor-not-allowed"
                      >
                       {/* Filled Heart - always wishlisted on WishlistPage */}
<svg className="w-6 h-6" fill="#e53e3e" viewBox="0 0 24 24" stroke="none">
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
</svg>

                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/cotton-yoga-mats" className="text-sm font-medium text-teal-600 hover:text-teal-500">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}