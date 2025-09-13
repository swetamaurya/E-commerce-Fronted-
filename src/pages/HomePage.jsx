import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ImageSlider from '../components/ImageSlider';
import productApi from '../services/productApi';

// Sample data for the homepage
const categoryData = [
  {
    id: 1,
    name: "COTTON YOGA MATS",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    link: "/cotton-yoga-mats"
  },
  {
    id: 2,
    name: "BEDSIDE RUNNERS",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    link: "/bedside-runners"
  },
  {
    id: 3,
    name: "MATS COLLECTION",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    link: "/mats-collection"
  },
  {
    id: 4,
    name: "BATH MATS",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    link: "/bath-mats"
  },
  {
    id: 5,
    name: "AREA RUGS",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    link: "/area-rugs"
  }
];



const customerReviews = [
  {
    id: 1,
    name: "Jatin Pathak",
    rating: 5,
    date: "29/08/25",
    review: "love love love this little rug - even better than the picture!",
    image: "/images/review-rug-1.jpg"
  },
  {
    id: 2,
    name: "Pratik",
    rating: 5,
    date: "27/08/25",
    review: "The Package Came In Neatly Packed. The Rug Is Woven beautifully.",
    image: "/images/review-rug-2.jpg"
  },
  {
    id: 3,
    name: "Vivan",
    rating: 5,
    date: "26/08/25",
    review: "Perfect For My Sofa. I Am Using The Runner In Front Of my living room.",
    image: "/images/review-rug-3.jpg"
  }
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allProductsLoading, setAllProductsLoading] = useState(true);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Debug: Log the current state
  // console.log('HomePage render - allProducts:', allProducts);
  // console.log('HomePage render - allProductsLoading:', allProductsLoading);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getFeaturedProducts();
        setFeaturedProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // No fallback data - show empty state
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllProducts = async () => {
      try {
        setAllProductsLoading(true);
        console.log('Fetching all products...');
        
        // Test direct API call first
        const directResponse = await fetch('https://e-commerce-backend-r6s0.onrender.com/api/products/getAll/');
        console.log('Direct API response status:', directResponse.status);
        
        if (!directResponse.ok) {
          throw new Error(`HTTP error! status: ${directResponse.status}`);
        }
        
        const directData = await directResponse.json();
        console.log('Direct API data:', directData);
        
        // Now try with productApi
        const response = await productApi.getAllProducts();
        console.log('All products API response:', response);
        const products = response.data || [];
        console.log('Products data:', products);
        // Take only first 4 products
        setAllProducts(products.slice(0, 4));
        console.log('Set all products:', products.slice(0, 4));
      } catch (error) {
        console.error('Error fetching all products:', error);
        console.error('Error details:', error.message);
        setAllProducts([]);
      } finally {
        setAllProductsLoading(false);
      }
    };

    fetchFeaturedProducts();
    fetchAllProducts();
  }, []);

  // Auto-rotate categories - responsive based on screen size
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategoryIndex((prevIndex) => {
        const itemsPerView = isMobile ? 1 : 4;
        const maxIndex = Math.max(0, categoryData.length - itemsPerView);
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isMobile]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe || isRightSwipe) {
      const itemsPerView = isMobile ? 1 : 4;
      const maxIndex = Math.max(0, categoryData.length - itemsPerView);
      
      if (isLeftSwipe) {
        setCurrentCategoryIndex((prev) => prev >= maxIndex ? 0 : prev + 1);
      } else {
        setCurrentCategoryIndex((prev) => prev <= 0 ? maxIndex : prev - 1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Image Slider Section */}
      <ImageSlider />

      {/* Royal Thread Text Section */}
      <section className="py-6 sm:py-10 md:py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center justify-center">
            {/* Tagline */}
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-700 mb-2 sm:mb-3 md:mb-4">
              Premium Handmade Rugs & Mats
            </h2>
            
            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mb-4 sm:mb-6 md:mb-8 px-2 leading-relaxed">
              Discover the finest collection of handcrafted rugs, yoga mats, and home accessories. 
              Each piece is carefully crafted with premium materials for your comfort and style.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
              <Link 
                to="/cotton-yoga-mats" 
                className="bg-gray-900 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-md font-semibold hover:bg-gray-800 transition-all duration-300 text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Shop Collection
              </Link>
              <Link 
                to="/area-rugs" 
                className="border-2 border-gray-900 text-gray-900 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-md font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                View Rugs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Category Section - 4 Categories Carousel */}
      <section className="py-6 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8 md:mb-12">BRAND CATEGORY</h2>
          
          {/* Carousel Container */}
          <div 
            className="relative overflow-hidden shadow-2xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Categories Carousel - Show 4 at a time on desktop, 1 on mobile */}
            <div 
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentCategoryIndex * (isMobile ? 100 : 25)}%)` }}
            >
              {categoryData.map((category, index) => (
                <div key={category.id} className="w-full sm:w-1/2 md:w-1/4 flex-shrink-0">
                  <Link 
                    to={category.link} 
                    className="block group"
                    onClick={() => {
                      // Scroll to top before navigation
                      window.scrollTo({ top: 0, behavior: "instant" });
                    }}
                  >
                    <div className="relative h-[35vh] sm:h-[45vh] md:h-[55vh] lg:h-[60vh] overflow-hidden">
                      {/* Background Image */}
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${category.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20 group-hover:from-black/60 group-hover:via-black/40 group-hover:to-black/30 transition-all duration-300" />
                        
                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-center text-white px-4 sm:px-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-300 drop-shadow-lg">
                              {category.name}
                            </h3>
                            <p className="text-sm sm:text-base md:text-lg font-light mb-4 sm:mb-6 opacity-90">
                              Click to explore
                            </p>
                            <div className="bg-white bg-opacity-25 backdrop-blur-sm px-6 sm:px-8 py-2 sm:py-3 rounded-full group-hover:bg-opacity-35 transition-all duration-300 shadow-lg">
                              <span className="text-sm sm:text-base font-bold text-white">SHOP NOW</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => {
                const itemsPerView = isMobile ? 1 : 4;
                const maxIndex = Math.max(0, categoryData.length - itemsPerView);
                setCurrentCategoryIndex((prev) => prev <= 0 ? maxIndex : prev - 1);
              }}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
              aria-label="Previous categories"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => {
                const itemsPerView = isMobile ? 1 : 4;
                const maxIndex = Math.max(0, categoryData.length - itemsPerView);
                setCurrentCategoryIndex((prev) => prev >= maxIndex ? 0 : prev + 1);
              }}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
              aria-label="Next categories"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Pagination Dots - Responsive based on screen size */}
          <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 space-x-2 sm:space-x-3">
            {(() => {
              // Calculate dots based on screen size
              const itemsPerView = isMobile ? 1 : 4;
              const totalDots = Math.max(1, categoryData.length - itemsPerView + 1);
              
              return Array.from({ length: totalDots }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCategoryIndex(index)}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                    index === currentCategoryIndex
                      ? 'bg-gray-800 scale-125 shadow-lg'
                      : 'bg-gray-300 hover:bg-gray-500 hover:scale-110'
                  }`}
                  aria-label={`Go to categories starting from ${index + 1}`}
                />
              ));
            })()}
          </div>
        </div>
      </section>


      {/* In The Spotlight Section */}
      <section className="py-8 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-12 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">IN THE SPOTLIGHT</h2>
            <Link to="/cotton-yoga-mats" className="text-gray-600 underline hover:text-gray-800 text-sm sm:text-base">
              VIEW ALL
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 items-stretch">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : featuredProducts.length > 0 ? featuredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No featured products available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-12 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">ALL PRODUCT</h2>
            <Link to="/all-products" className="text-gray-600 underline hover:text-gray-800 text-sm sm:text-base">
              VIEW ALL
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 items-stretch">
            {(allProductsLoading !== false) ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-500">Loading products...</p>
              </div>
            ) : (allProducts && allProducts.length > 0) ? allProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No products available</p>
                <p className="text-sm text-gray-400 mt-2">Loading state: {allProductsLoading ? 'true' : 'false'}</p>
                <p className="text-sm text-gray-400">Products count: {allProducts ? allProducts.length : 'undefined'}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Customer Feedback Section */}
      <section className="py-8 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-12 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">CUSTOMERS FEEDBACK</h2>
            <Link to="/cotton-yoga-mats" className="text-gray-600 underline hover:text-gray-800 text-sm sm:text-base">
              VIEW ALL
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {customerReviews.map((review) => (
              <div key={review.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-3 sm:mb-4 overflow-hidden">
                  <img 
                    src={review.image} 
                    alt="Review Product"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">{review.name}</h3>
                <div className="flex items-center mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-2">{review.date}</p>
                <p className="text-gray-700 text-sm sm:text-base">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-8 sm:py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to Transform Your Home?</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8">Discover our exclusive collection of handmade rugs and mats</p>
          <Link 
            to="/cotton-yoga-mats" 
            className="bg-white text-gray-900 px-6 sm:px-8 py-2.5 sm:py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            Explore Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
