import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
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


const allProducts = [
  {
    id: 1,
    title: "HANDWOVEN TRADITIONAL KILIM RUG FOR LIVING ROOM",
    price: 1399,
    mrp: 3998,
    off: "65%",
    badge: "Extra 50% OFF",
    image: "/images/kilim-rug.jpg",
    type: "Kilim Rug",
    size: "5x8 ft"
  },
  {
    id: 2,
    title: "PREMIUM HANDWOVEN RUG FOR LIVING ROOM",
    price: 1199,
    mrp: 2499,
    off: "52%",
    badge: "Extra 50% OFF",
    image: "/images/premium-rug.jpg",
    type: "Premium Rug",
    size: "4x6 ft"
  },
  {
    id: 3,
    title: "PREMIUM HANDMADE KNITTED RUG FOR LIVING ROOM",
    price: 1899,
    mrp: 6998,
    off: "72%",
    badge: "Extra 50% OFF",
    image: "/images/knitted-rug.jpg",
    type: "Knitted Rug",
    size: "6x9 ft"
  },
  {
    id: 4,
    title: "PREMIUM HANDWOVEN RUG FOR LIVING ROOM",
    price: 999,
    mrp: 1999,
    off: "50%",
    badge: "Extra 50% OFF",
    image: "/images/handwoven-rug.jpg",
    type: "Handwoven Rug",
    size: "3x5 ft"
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
  const [loading, setLoading] = useState(true);

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

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Royal Thread</h1>
          <p className="text-xl mb-8">Discover the finest handmade rugs and mats for your home</p>
          <Link 
            to="/cotton-yoga-mats" 
            className="bg-white text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Brand Category Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Pagination Dots */}
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">BRAND CATEGORY</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {categoryData.map((category) => (
              <Link key={category.id} to={category.link} className="group">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-black overflow-hidden group-hover:scale-105 transition-transform">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop By Category Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">SHOP BY CATEGORY</h2>
          <div className="text-center mb-12">
            <Link to="/cotton-yoga-mats" className="text-gray-600 underline hover:text-gray-800">
              VIEW ALL
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categoryData.slice(0, 3).map((category) => (
              <Link key={category.id} to={category.link} className="group">
                <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow">
                  <div className="aspect-[4/3] bg-gray-200">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-white p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                  </div>
                </div>
              </Link>
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
            <Link to="/cotton-yoga-mats" className="text-gray-600 underline hover:text-gray-800">
              VIEW ALL
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
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
