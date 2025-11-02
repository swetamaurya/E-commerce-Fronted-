import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ImageSlider from '../components/ImageSlider';
import productApi from '../services/productApi';
import { API_URL } from '../config';

// Sample data for the homepage
const categoryData = [
  {
    id: 1,
    name: "AREA RUGS",
    image: "/images/area.png",
    link: "/area-rugs"
  },
  {
    id: 2,
    name: "BEDSIDE RUNNERS",
    image: "/images/bedside.png",
    link: "/bedside-runners"
  },
  {
    id: 3,
    name: "MATS COLLECTION",
    image: "https://images.unsplash.com/photo-1671576414507-d229f3211069?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODR8fHJ1ZyUyMG1hdHMlMjBjb2xsZWN0aW9uc3xlbnwwfHwwfHx8MA%3D%3D",
    link: "/mats-collection"
  },
  {
    id: 4,
    name: "BATH MATS",
    subtitle: "COMING SOON",
    image: "https://images.unsplash.com/photo-1741282306930-a145155ba880?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8",
    // link: "/bath-mats"
  },
 {
    id: 5,
    name: "COTTON YOGA MATS",
    subtitle: "COMING SOON",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    // link: "/cotton-yoga-mats"
  },
];

 
const customerReviews = [
  {
    id: 1,
    name: "Arushi",
    rating: 5,
    date: "29/08/2025",
    review: "Feels plush, hides spills, no smell, room quieter instantly.",
    image: "/images/doormate1.jpeg"
  },
  {
    id: 2,
    name: "Bharat Kushwaha",
    rating: 5,
    date: "27/08/2025",
    review: "The Package Came In Neatly Packed. The Rug Is Woven beautifully.",
    image: "/images/IMG_2034.JPG"
  },
  {
    id: 3,
    name: "Bhavay",
    rating: 5,
    date: "25/08/2025",
    review: "Soft underfoot, neutral tone, chai wiped fast, zero odor, living room noticeably quieter now.",
    image: "/images/IMG_2059.JPG"
  },
 {
    id: 4,
    name: "Vansh Patel",
    rating: 5,
    date: "24/08/2025",
    review: "Excellent quality! Worth every penny. Will buy again.",
    image: "/images/review4.jpg",
  },
  {
    id: 5,
    name: "Neha Gupta",
    rating: 3,
    date: "22/08/2025",
    review: "Product is okay but color was a bit different from the photos.",
    image: "/images/review5.jpg",
  },
  {
    id: 6,
    name: "Rohan Verma",
    rating: 4,
    date: "20/08/2025",
    review: "Good texture and comfort. Packaging could be better though.",
    image: "/images/review6.jpg",
  },
  {
    id: 7,
    name: "Priya Singh",
    rating: 5,
    date: "18/08/2025",
    review: "Soft underfoot, perfect for my bedroom setup. Highly recommend!",
    image: "/images/review7.jpg",
  },
  {
    id: 8,
    name: "Amit Yadav",
    rating: 4,
    date: "15/08/2025",
    review: "The product matches the description. Feels durable and stylish.",
    image: "/images/review8.jpg",
  },
];

 

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allProductsLoading, setAllProductsLoading] = useState(true);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [hasMoreFeatured, setHasMoreFeatured] = useState(false);
  const [hasMoreAllProducts, setHasMoreAllProducts] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

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

  // Reset carousel index when layout (itemsPerView) changes to avoid blank gaps
  useEffect(() => {
    setCurrentCategoryIndex(0);
  }, [isMobile]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getFeaturedProducts();
        const list = response.data || [];
        setHasMoreFeatured(list.length > 4);
        setFeaturedProducts(list.slice(0, 4));
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // No fallback data - show empty state
        setFeaturedProducts([]);
        setHasMoreFeatured(false);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllProducts = async () => {
      try {
        setAllProductsLoading(true);
        console.log('[HomePage] Fetching all products...');
        
        // Use only productApi to avoid duplicate calls
        const response = await productApi.getAllProducts();
        console.log('[HomePage] All products API response:', response);
        const products = response.data || [];
        console.log('[HomePage] Products data:', products);
        
        // Take only first 4 products
        setHasMoreAllProducts(products.length > 4);
        setAllProducts(products.slice(0, 4));
        console.log('[HomePage] Set all products:', products.slice(0, 4));
      } catch (error) {
        console.error('[HomePage] Error fetching all products:', error);
        setAllProducts([]);
        setHasMoreAllProducts(false);
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
  // Auto-rotate feedback/testimonials - responsive based on screen size
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeedbackIndex((prevIndex) => {
        const itemsPerView = isMobile ? 1 : 3;
        const maxIndex = Math.max(0, customerReviews.length - itemsPerView);
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
      <section className="py-4 sm:py-8 md:py-10 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center justify-center">
            {/* Tagline */}
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-gray-600 mb-2 sm:mb-2 md:mb-3 tracking-wide">
              Premium Handmade Rugs & Mats
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mb-2 sm:mb-4 md:mb-6 px-2 leading-relaxed font-light">
              Discover the finest collection of handcrafted rugs, yoga mats, and home accessories.
              Each piece is carefully crafted with premium materials for your comfort and style.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
              <Link
                to="/cotton-yoga-mats"
                className="bg-gray-900 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-md font-medium hover:bg-gray-800 transition-all duration-300 text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 tracking-wide"
              >
                Shop Collection
              </Link>
              <Link
                to="/area-rugs"
                className="border-2 border-gray-900 text-gray-900 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-md font-medium hover:bg-gray-900 hover:text-white transition-all duration-300 text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 tracking-wide"
              >
                View Rugs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Category Section - 4 Categories Carousel */}
      <section className="py-4 sm:py-8 md:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-center text-gray-600 mb-4 sm:mb-8 md:mb-10 tracking-[0.15em] uppercase">Shop By Category</h2>
          
          {/* Carousel Container */}
          <div
            className="relative overflow-hidden rounded-lg"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Categories Carousel - Show 4 at a time on desktop, 1 on mobile */}
            <div 
              className="flex transition-transform duration-1000 ease-in-out"
              style={{
                transform: (() => {
                  const itemsPerView = isMobile ? 1 : 4;
                  const maxIndex = Math.max(0, categoryData.length - itemsPerView);
                  const safeIndex = Math.min(currentCategoryIndex, maxIndex);
                  return `translateX(-${safeIndex * (isMobile ? 100 : 25)}%)`;
                })()
              }}
            >
              {categoryData.map((category, index) => {
                const isComingSoon = category.subtitle === "COMING SOON";
                return (
                  <div key={category.id} className="w-full sm:w-1/2 md:w-1/4 flex-shrink-0 px-1">
                    <Link
                      to={category.link}
                      className={`block group ${!category.link ? 'cursor-default' : ''}`}
                      onClick={(e) => {
                        if (!category.link) {
                          e.preventDefault();
                        } else {
                          // Scroll to top before navigation
                          window.scrollTo({ top: 0, behavior: "instant" });
                        }
                      }}
                    >
                      <div className={`relative aspect-[3/4] overflow-hidden bg-gray-50 ${isComingSoon ? 'opacity-60' : ''}`}>
                        {/* Background Image - Clean without overlays */}
                        <img
                          src={category.image}
                          alt={category.name}
                          className={`w-full h-full object-cover transition-transform duration-500 ${!isComingSoon ? 'group-hover:scale-105' : ''}`}
                        />

                        {/* Coming Soon Overlay */}
                        {isComingSoon && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="bg-white/95 px-4 py-3 rounded-lg text-center">
                              <p className="text-gray-900 font-semibold text-sm">COMING SOON</p>
                            </div>
                          </div>
                        )}

                        {/* Clean text with subtle background */}
                        <div className="absolute top-4 left-4 right-4">
                          <div className={`${isComingSoon ? 'bg-gray-400/80 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'} px-3 py-2 sm:px-4 sm:py-3 inline-block`}>
                            <h3 className={`${isComingSoon ? 'text-gray-600' : 'text-gray-900'} font-normal tracking-[0.1em] text-xs sm:text-sm md:text-base uppercase`}>
                              {category.name}
                            </h3>
                            {category.subtitle && (
                              <p className={`${isComingSoon ? 'text-gray-600' : 'text-gray-500'} text-[10px] sm:text-xs font-light mt-0.5 tracking-wider`}>
                                {category.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => {
                const itemsPerView = isMobile ? 1 : 4;
                const maxIndex = Math.max(0, categoryData.length - itemsPerView);
                setCurrentCategoryIndex((prev) => prev <= 0 ? maxIndex : prev - 1);
              }}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
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
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
              aria-label="Next categories"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Pagination Dots - Responsive based on screen size */}
          <div className="flex justify-center mt-2 sm:mt-4 md:mt-6 space-x-2 sm:space-x-3">
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

      {/* Video Section */}
      <section className="py-4 sm:py-8 bg-white">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            {/* Video Container with Overlay */}
            <div
              className="relative overflow-hidden rounded-lg shadow-2xl group cursor-pointer"
              onClick={() => setShowVideo(true)}
            >
              {/* Background Grid of Images */}
              <div className="grid grid-cols-2 sm:grid-cols-4 h-[400px] sm:h-[500px] md:h-[600px]">
                <div
                  className="bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=60')`
                  }}
                />
                <div
                  className="bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=600&auto=format&fit=crop&q=60')`
                  }}
                />
                <div
                  className="bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&auto=format&fit=crop&q=60')`
                  }}
                />
                <div
                  className="bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600&auto=format&fit=crop&q=60')`
                  }}
                />
              </div>

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80 group-hover:from-black/70 group-hover:via-black/80 group-hover:to-black/90 transition-all duration-300" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                <p className="text-sm sm:text-lg font-light tracking-widest mb-1 sm:mb-2 italic">About Our</p>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold mb-2 sm:mb-4 drop-shadow-2xl tracking-wide">BRAND</h2>
                <h3 className="text-xl sm:text-3xl md:text-4xl font-normal italic mb-4 sm:mb-6 tracking-wide border-b-2 border-white pb-2 sm:pb-3">
                  Carpet Making Process
                </h3>

                {/* Play Button */}
                <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-5 rounded-full hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>

                <p className="text-xs sm:text-sm mt-2 sm:mt-4 font-light opacity-90">Click to watch our craftsmanship story</p>
              </div>

              {/* Video Player - Shows inline when clicked */}
              {showVideo && (
                <div className="absolute inset-0 bg-black z-10 flex items-center justify-center">
                  <video
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    controlsList="nodownload"
                    onEnded={() => setShowVideo(false)}
                  >
                    <source src="/images/carpet-making.mp4" type="video/mp4" />
                    <source src="/images/carpet-making.webm" type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                  <button
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-xl transition-all hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowVideo(false);
                    }}
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* In The Spotlight Section */}
      {/* <section className="py-4 sm:py-8 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-normal uppercase">In The Spotlight</h2>
            {hasMoreFeatured && (
              <Link to="/cotton-yoga-mats" className="text-gray-600 underline hover:text-gray-900 text-sm sm:text-base">
                VIEW ALL
              </Link>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-3 md:gap-4 items-stretch">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : featuredProducts.length > 0 ? featuredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} category={product.category} />
            )) : (
              <div className="col-span-full text-center py-6">
                <div className="flex flex-col items-center">
                  <img
                    src="/logo9.png"
                    alt="Coming Soon Illustration"
                    className="w-20 h-20 sm:w-24 sm:h-24 mb-4 opacity-80"
                    loading="lazy"
                  />
                  <p className="text-gray-600 text-lg font-semibold">Coming Soon</p>
                  <p className="text-gray-500 text-sm mt-2">Featured products will appear here shortly.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section> */}

      {/* All Products Section */}
      <section className="py-4 sm:py-8 bg-white">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-normal uppercase">All Products</h2>
            {hasMoreAllProducts && (
              <Link to="/all-products" className="text-gray-600 underline hover:text-gray-900 text-sm sm:text-base">
                VIEW ALL
              </Link>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-3 md:gap-4 items-stretch">
            {(allProductsLoading !== false) ? (
              <div className="col-span-full flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-500">Loading products...</p>
              </div>
            ) : (allProducts && allProducts.length > 0) ? allProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} category={product.category} />
            )) : (
              <div className="col-span-full text-center py-6">
                <p className="text-gray-500">No products available</p>
                <p className="text-sm text-gray-400 mt-2">Loading state: {allProductsLoading ? 'true' : 'false'}</p>
                <p className="text-sm text-gray-400">Products count: {allProducts ? allProducts.length : 'undefined'}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Customer Feedback Section - Auto-scrolling Carousel */}
      <section className="py-4 sm:py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-center text-gray-600 mb-4 sm:mb-8 md:mb-10 tracking-[0.15em] uppercase">Customers Feedback</h2>

          {/* Carousel Container */}
          <div
            className="relative overflow-hidden rounded-lg"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Feedback Carousel - Show 3 at a time on desktop, 1 on mobile */}
            <div
              className="flex transition-transform duration-1000 ease-in-out"
              style={{
                transform: (() => {
                  const itemsPerView = isMobile ? 1 : 3;
                  const maxIndex = Math.max(0, customerReviews.length - itemsPerView);
                  const safeIndex = Math.min(currentFeedbackIndex || 0, maxIndex);
                  return `translateX(-${safeIndex * (isMobile ? 100 : 33.333)}%)`;
                })()
              }}
            >
              {customerReviews.map((review) => (
                <div key={review.id} className="w-full sm:w-1/2 md:w-1/3 flex-shrink-0 px-2 sm:px-3">
                  <div className="bg-white p-4 sm:p-5 rounded-lg shadow-lg h-full flex flex-col">
                    <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-2 sm:mb-3 overflow-hidden">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base tracking-wide">{review.name}</h3>
                    <div className="flex items-center mb-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2">{review.date}</p>
                    <p className="text-gray-600 text-sm sm:text-base flex-1">{review.review}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => {
                const itemsPerView = isMobile ? 1 : 3;
                const maxIndex = Math.max(0, customerReviews.length - itemsPerView);
                setCurrentFeedbackIndex((prev) => (prev || 0) <= 0 ? maxIndex : (prev || 0) - 1);
              }}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
              aria-label="Previous feedback"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => {
                const itemsPerView = isMobile ? 1 : 3;
                const maxIndex = Math.max(0, customerReviews.length - itemsPerView);
                setCurrentFeedbackIndex((prev) => (prev || 0) >= maxIndex ? 0 : (prev || 0) + 1);
              }}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
              aria-label="Next feedback"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-2 sm:mt-4 md:mt-6 space-x-2 sm:space-x-3">
            {(() => {
              const itemsPerView = isMobile ? 1 : 3;
              const totalDots = Math.max(1, customerReviews.length - itemsPerView + 1);

              return Array.from({ length: totalDots }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeedbackIndex(index)}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                    index === (currentFeedbackIndex || 0)
                      ? 'bg-gray-800 scale-125 shadow-lg'
                      : 'bg-gray-300 hover:bg-gray-500 hover:scale-110'
                  }`}
                  aria-label={`Go to feedback starting from ${index + 1}`}
                />
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-4 sm:py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-4 tracking-wide">Ready to Transform Your Home?</h2>
          <p className="text-lg sm:text-xl mb-4 sm:mb-6 font-light tracking-wide">Discover our exclusive collection of handmade rugs and mats</p>
          <Link
            to="/all-products"
            className="bg-white text-gray-900 px-6 sm:px-8 py-2.5 sm:py-3 rounded-md font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base tracking-wide"
          >
            Explore Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
