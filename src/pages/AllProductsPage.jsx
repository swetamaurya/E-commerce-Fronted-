import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import productApi from '../services/productApi';
import { wishlistApi } from '../services/api';

const initialFilters = {
  type: [],      // [] = All (multi-select)
  size: [],      // [] = All
  color: [],     // [] = All
  price: "ALL",  // single range
  sort: "pop",
};

export default function AllProductsPage() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [wishlistStatus, setWishlistStatus] = useState({}); // Track wishlist status for all products
  const [searchQuery, setSearchQuery] = useState(''); // Search query from URL

  // Get search query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const search = urlParams.get('search');
    if (search) {
      setSearchQuery(search);
    } else {
      setSearchQuery('');
    }
  }, [location.search]);

  // Clear search when component mounts without search query
  useEffect(() => {
    if (!location.search.includes('search=')) {
      setSearchQuery('');
    }
  }, [location.search]);

  // Fetch wishlist status for all products
  const fetchWishlistStatus = async (products) => {
    if (!localStorage.getItem("token") || !products.length) return;
    
    try {
      // Batch fetch wishlist status for all products
      const wishlistPromises = products.map(async (product) => {
        try {
          const res = await wishlistApi.checkWishlistItem(product.id || product._id);
          return { productId: product.id || product._id, isWishlisted: !!res?.inWishlist };
        } catch (error) {
          console.error(`Error checking wishlist for product ${product.id || product._id}:`, error);
          return { productId: product.id || product._id, isWishlisted: false };
        }
      });
      
      const results = await Promise.all(wishlistPromises);
      const statusMap = {};
      results.forEach(({ productId, isWishlisted }) => {
        statusMap[productId] = isWishlisted;
      });
      
      setWishlistStatus(statusMap);
    } catch (error) {
      console.error('Error fetching wishlist status:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let abortController = new AbortController();
    
    const fetchProducts = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      
      try {
        const response = await productApi.getAllProducts();
        const data = response.data || [];
        
        if (!isMounted) {
          return;
        }
        
        const products = Array.isArray(data) ? data : [];
        setProducts(products);
        
        // Fetch wishlist status for all products
        if (products.length > 0) {
          fetchWishlistStatus(products);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    // Debounce the fetch to prevent multiple calls
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        fetchProducts();
      }
    }, 100);
    
    return () => { 
      isMounted = false;
      abortController.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  // --- filter (multi-select + price)
  const filtered = useMemo(() => {
    const priceMatch = (price) => {
      const numPrice = Number(price ?? 0);
      switch (filters.price) {
        case "0-200": return numPrice >= 0 && numPrice <= 200;
        case "200-500": return numPrice >= 200 && numPrice <= 500;
        case "500-700": return numPrice >= 500 && numPrice <= 700;
        case "700-1000": return numPrice >= 700 && numPrice <= 1000;
        case "1000-1500": return numPrice >= 1000 && numPrice <= 1500;
        case "1500-2000": return numPrice >= 1500 && numPrice <= 2000;
        case "2000-2500": return numPrice >= 2000 && numPrice <= 2500;
        case "2500P": return numPrice >= 2500;
        default: return true; // "ALL"
      }
    };
    const inSel = (selArr, val) => selArr.length === 0 || selArr.includes(val);

    return products
      .filter((p) => {
        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const searchableFields = [
            p.name,
            p.description,
            p.category,
            p.type,
            p.color,
            p.size,
            p.material,
            p.brand
          ].filter(Boolean).join(' ').toLowerCase();
          
          // Check if any word from the query matches any part of the searchable fields
          const queryWords = query.split(/\s+/);
          const matches = queryWords.some(word => 
            searchableFields.includes(word) || 
            searchableFields.split(/\s+/).some(field => field.includes(word))
          );
          
          
          return matches;
        }
        return true;
      })
      .filter((p) => inSel(filters.type, p.type || p.category))
      .filter((p) => inSel(filters.size, p.size || p.variants?.[0]?.size))
      .filter((p) => inSel(filters.color, p.color || p.variants?.[0]?.color))
      .filter((p) => priceMatch(Number(p.price ?? 0)));
  }, [products, filters, searchQuery]);

  // --- sort
  const visibleProducts = useMemo(() => {
    const arr = [...filtered];
    switch (filters.sort) {
      case "plh": arr.sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0)); break;
      case "phl": arr.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0)); break;
      case "new": arr.sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0)); break;
      default:    arr.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)); // "pop"
    }
    return arr;
  }, [filtered, filters.sort]);

  // facet options (derived from products, used for counts/labels)
  const facetOptions = useMemo(() => {
    const uniq = (arr) => Array.from(new Set(arr)).filter(Boolean);
    return {
      types: uniq(products.map((p) => p.category)),
      sizes: uniq(products.flatMap((p) => p.variants?.map(v => v.size) || [])),
      colors: uniq(products.flatMap((p) => p.variants?.map(v => v.color) || [])),
    };
  }, [products]);

  // Clear all filters
  const clearAllFilters = () => {
    setFilters(initialFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = filters.type.length > 0 || filters.size.length > 0 || filters.color.length > 0 || filters.price !== "ALL";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 md:pb-10">
      {/* Page Header */}
      <div className="text-center mt-4 sm:mt-6 md:mt-8 mb-4 sm:mb-6 md:mb-8">
        <h1 className="font-extrabold tracking-[.08em] text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-900 mb-2 sm:mb-3">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-2 leading-relaxed">
          {searchQuery 
            ? `Found ${visibleProducts.length} products matching your search`
            : 'Discover our complete collection of premium handcrafted products'
          }
        </p>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              // Clear search from URL
              const url = new URL(window.location);
              url.searchParams.delete('search');
              window.history.replaceState({}, '', url);
            }}
            className="mt-3 text-sm text-teal-600 hover:text-teal-700 underline"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        products={products}
        facetOptions={facetOptions}
        total={visibleProducts.length}
      />

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mt-4 sm:mt-6 mb-2 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
          <span className="text-sm text-gray-600">
            {visibleProducts.length} of {products.length} products
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-teal-600 hover:text-teal-700 underline"
            >
              Clear all filters
            </button>
          )}
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-sm text-gray-600">View:</span>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-teal-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              aria-label="Grid view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-teal-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              aria-label="List view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-sm text-gray-500">Loading products...</p>
        </div>
      ) : visibleProducts.length === 0 ? (
        /* No Results State */
        <div className="py-20 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"/>
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {hasActiveFilters 
              ? "Try adjusting your filters or search terms."
              : "We couldn't find any products in this category."
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors text-sm"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        /* Products Grid/List */
        <section className={`mt-6 ${
          viewMode === 'grid' 
            ? 'grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
            : 'space-y-4'
        }`}>
          {visibleProducts.map((p) => (
            <ProductCard 
              key={p.id ?? `${p.name}-${p._id ?? Math.random()}`} 
              product={p}
              viewMode={viewMode}
              wishlistStatus={wishlistStatus[p.id || p._id] || false}
              onWishlistChange={(productId, isWishlisted) => {
                setWishlistStatus(prev => ({
                  ...prev,
                  [productId]: isWishlisted
                }));
              }}
            />
          ))}
        </section>
      )}
    </main>
  );
}
