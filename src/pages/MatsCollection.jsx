import { useEffect, useState } from "react";
import productApi from "../services/productApi";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import SEO from "../components/SEO";
import { wishlistApi } from "../services/api";

const initialFilters = {
  type: [],      // [] = All (multi-select)
  size: [],      // [] = All
  color: [],     // [] = All
  price: "ALL",  // single range
  sort: "pop",
};

export default function MatsCollection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [viewMode, setViewMode] = useState('grid');
  const [wishlistStatus, setWishlistStatus] = useState({});

  // Fetch wishlist status for all products
  const fetchWishlistStatus = async (products) => {
    if (!localStorage.getItem("token") || !products.length) return;
    
    try {
      const wishlistPromises = products.map(async (product) => {
        try {
          const res = await wishlistApi.checkWishlistItem(product.id);
          return { productId: product.id, isWishlisted: !!res?.inWishlist };
        } catch (error) {
          console.error(`Error checking wishlist for product ${product.id}:`, error);
          return { productId: product.id, isWishlisted: false };
        }
      });
      
      const results = await Promise.all(wishlistPromises);
      const statusMap = {};
      results.forEach(({ productId, isWishlisted }) => {
        statusMap[productId] = isWishlisted;
      });
      
      setWishlistStatus(statusMap);
    } catch (error) {
      console.error("Error fetching wishlist status:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      
      try {
        // Fetch all products and filter for indoor/outdoor mats
        const response = await productApi.getAllProducts();
        const allProducts = Array.isArray(response.data) ? response.data : [];
        
        if (!isMounted) return;
        
        // Filter products that have categories "In Door Mats" or "Out Door Mats"
        const matProducts = allProducts.filter(product => {
          const category = product.category || '';
          return category === 'In Door Mats' || category === 'Out Door Mats';
        });
        
        setProducts(matProducts);
        
        // Fetch wishlist status for all products
        if (matProducts.length > 0) {
          fetchWishlistStatus(matProducts);
        }
      } catch (error) {
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchProducts();
    
    return () => { 
      isMounted = false;
    };
  }, []);

  return (
    <>
      <SEO
        title="Mats Collection - Indoor & Outdoor Mats | Royal Thread"
        description="Complete collection of indoor and outdoor mats. From meditation to decoration, find the perfect mat for every space."
        keywords="mats collection, indoor mats, outdoor mats, yoga mats, meditation mats, decorative mats"
        image="/images/mats-collection.jpg"
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              MATS COLLECTION
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Complete collection of indoor and outdoor mats. From meditation to decoration, find the perfect mat for every space.
            </p>
          </div>

          {/* Filter Bar */}
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            viewMode={viewMode}
            setViewMode={setViewMode}
            totalItems={products.length}
          />

          {/* All Mats Products */}
          <div className="mb-12">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    wishlistStatus={wishlistStatus[product.id] || false}
                    onWishlistChange={(productId, isWishlisted) => {
                      setWishlistStatus(prev => ({
                        ...prev,
                        [productId]: isWishlisted
                      }));
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No mats found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
