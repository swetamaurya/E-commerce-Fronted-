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
    image: "/images/cotton-yoga-mats.jpg",
    link: "/cotton-yoga-mats"
  },
  {
    id: 2,
    name: "BEDSIDE RUNNERS",
    image: "/images/bedside-runners.jpg",
    link: "/bedside-runners"
  },
  {
    id: 3,
    name: "MATS COLLECTION",
    image: "/images/mats-collection.jpg",
    link: "/mats-collection"
  },
  {
    id: 4,
    name: "BATH MATS",
    image: "/images/bath-mats.jpg",
    link: "/bath-mats"
  },
  {
    id: 5,
    name: "AREA RUGS",
    image: "/images/area-rugs.jpg",
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

  // Debug: Log the current state
  console.log('HomePage render - allProducts:', allProducts);
  console.log('HomePage render - allProductsLoading:', allProductsLoading);

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
        const directResponse = await fetch('http://localhost:5002/api/products/getAll/');
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

  // Auto-rotate categories - show 4 at a time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategoryIndex((prevIndex) => {
        // Move by 1 category at a time, but ensure we don't go beyond the limit
        const maxIndex = Math.max(0, categoryData.length - 4);
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Image Slider Section */}
      <ImageSlider />

      {/* Royal Thread Logo Section */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center">
            {/* Logo */}
            <div className="mb-6">
              <img 
                src="/royal-thread-logo.svg" 
                alt="Royal Thread Logo" 
                className="h-24 md:h-32 w-auto"
              />
            </div>
            
            {/* Tagline */}
            <h2 className="text-2xl md:text-3xl font-light text-gray-700 mb-4">
              Premium Handmade Rugs & Mats
            </h2>
            
            {/* Description */}
            <p className="text-lg text-gray-600 max-w-2xl mb-8">
              Discover the finest collection of handcrafted rugs, yoga mats, and home accessories. 
              Each piece is carefully crafted with premium materials for your comfort and style.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/cotton-yoga-mats" 
                className="bg-gray-900 text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
              >
                Shop Collection
              </Link>
              <Link 
                to="/area-rugs" 
                className="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-900 hover:text-white transition-colors"
              >
                View Rugs
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Brand Category Section - 4 Categories Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">BRAND CATEGORY</h2>
          
          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            {/* Categories Carousel - Show 4 at a time */}
            <div 
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentCategoryIndex * 25}%)` }}
            >
              {categoryData.map((category, index) => (
                <div key={category.id} className="w-1/4 flex-shrink-0">
                  <Link to={category.link} className="block group">
                    <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
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
                        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                        
                        {/* Content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white px-4">
                            <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
                              {category.name}
                            </h3>
                            <p className="text-sm md:text-base font-light mb-4 opacity-90">
                              Click to explore
                            </p>
                            <div className="inline-block bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full group-hover:bg-opacity-30 transition-all duration-300">
                              <span className="text-xs font-semibold">SHOP NOW</span>
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
                const maxIndex = Math.max(0, categoryData.length - 4);
                setCurrentCategoryIndex((prev) => prev <= 0 ? maxIndex : prev - 1);
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
              aria-label="Previous categories"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => {
                const maxIndex = Math.max(0, categoryData.length - 4);
                setCurrentCategoryIndex((prev) => prev >= maxIndex ? 0 : prev + 1);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
              aria-label="Next categories"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Pagination Dots - Show only for the starting positions */}
          <div className="flex justify-center mt-8 space-x-3">
            {Array.from({ length: Math.max(1, categoryData.length - 3) }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCategoryIndex(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentCategoryIndex
                    ? 'bg-gray-800 scale-125'
                    : 'bg-gray-300 hover:bg-gray-500'
                }`}
                aria-label={`Go to categories starting from ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>


      {/* In The Spotlight Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">IN THE SPOTLIGHT</h2>
            <Link to="/cotton-yoga-mats" className="text-gray-600 underline hover:text-gray-800">
              VIEW ALL
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">ALL PRODUCT</h2>
            <Link to="/all-products" className="text-gray-600 underline hover:text-gray-800">
              VIEW ALL
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">CUSTOMERS FEEDBACK</h2>
            <Link to="/cotton-yoga-mats" className="text-gray-600 underline hover:text-gray-800">
              VIEW ALL
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {customerReviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={review.image} 
                    alt="Review Product"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{review.name}</h3>
                <div className="flex items-center mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-2">{review.date}</p>
                <p className="text-gray-700">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Home?</h2>
          <p className="text-xl mb-8">Discover our exclusive collection of handmade rugs and mats</p>
          <Link 
            to="/cotton-yoga-mats" 
            className="bg-white text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Explore Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
