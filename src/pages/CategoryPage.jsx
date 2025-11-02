import { useEffect, useMemo, useState } from "react";
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

export default function CategoryPage({ title, slug }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [wishlistStatus, setWishlistStatus] = useState({}); // Track wishlist status for all products
  const [showMobileFilterDrawer, setShowMobileFilterDrawer] = useState(false); // Mobile filter drawer

  // SEO data for each category
  const seoData = {
    'cotton-yoga-mats': {
      title: 'Cotton Yoga Mats - Premium Handmade Yoga Mats | Royal Thread',
      // description: 'Discover premium cotton yoga mats for comfortable practice. Handcrafted with love, perfect for yoga, meditation, and wellness. Shop now for the best quality.',
      keywords: 'cotton yoga mats, handmade yoga mats, premium yoga mats, meditation mats, wellness products',
      image: '/images/cotton-yoga-mats.jpg'
    },
    'bedside-runners': {
      title: 'Bedside Runners - Elegant Bedroom Decor | Royal Thread',
      // description: 'Beautiful bedside runners to enhance your bedroom decor. Handcrafted with premium materials for elegance and comfort.',
      keywords: 'bedside runners, bedroom decor, home textiles, handmade rugs, bedroom accessories',
      image: '/images/bedside-runners.jpg'
    },
    'mats-collection': {
      title: 'Mats Collection - Complete Home & Yoga Mats | Royal Thread',
      // description: 'Complete collection of home and yoga mats. From meditation to decoration, find the perfect mat for every space.',
      keywords: 'mats collection, home mats, yoga mats, meditation mats, decorative mats',
      image: '/images/mats-collection.jpg'
    },
    'bath-mats': {
      title: 'Bath Mats - Luxurious Bathroom Comfort | Royal Thread',
      // description: 'Luxurious bath mats for ultimate bathroom comfort. Soft, absorbent, and beautifully designed for your bathroom.',
      keywords: 'bath mats, bathroom accessories, luxury bath mats, soft bath mats, bathroom comfort',
      image: '/images/bath-mats.jpg'
    },
    'area-rugs': {
      title: 'Area Rugs - Beautiful Home Decoration | Royal Thread',
      // description: 'Beautiful area rugs to transform your home decoration. Handcrafted designs that add warmth and style to any room.',
      keywords: 'area rugs, home decoration, handmade rugs, decorative rugs, home textiles',
      image: '/images/area-rugs.jpg'
    }
  };

  const currentSeo = seoData[slug] || {
    title: `${title} - Royal Thread`,
    description: `Discover premium ${title.toLowerCase()} from Royal Thread. Handcrafted with love for your home.`,
    keywords: `${title.toLowerCase()}, handmade, premium quality, home textiles`,
    image: '/images/default-category.jpg'
  };

  // Fetch wishlist status for all products
  const fetchWishlistStatus = async (products) => {
    if (!localStorage.getItem("token") || !products.length) return;
    
    try {
      
      // Batch fetch wishlist status for all products
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
    }
  };

  useEffect(() => {
    let isMounted = true;
    let abortController = new AbortController();
    
    const fetchProducts = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      
      try {
        console.log(`[CategoryPage] Fetching products for category: ${slug}`);
        const response = await productApi.getProductsByCategory(slug);
        const data = response.data || [];

        if (!isMounted) {
          return;
        }

        const products = Array.isArray(data) ? data : [];
        console.log(`[CategoryPage] Found ${products.length} products for ${slug}`);
        console.log(`[CategoryPage] Response:`, response);
        console.log(`[CategoryPage] Products:`, products);

        if (products.length === 0) {
          console.warn(`⚠️ [CategoryPage] No products found for category ${slug}. Check if API endpoint is correct or if category name matches backend.`);
        }

        console.log('✅ [CategoryPage] Setting items with products:', products);
        console.log('✅ [CategoryPage] First product:', products[0]);
        setItems(products);

        // Fetch wishlist status for all products
        if (products.length > 0) {
          fetchWishlistStatus(products);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
        console.error(`[CategoryPage] Error fetching products for ${slug}:`, error);
        if (isMounted) {
          setItems([]);
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
  }, [slug]);

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

    return items
      .filter((p) => inSel(filters.type, p.type || p.category))
      .filter((p) => {
        if (filters.size.length === 0) return true;

        // Extract sizes from multiple possible fields
        const sizeSources = [
          p.sizes,
          p.size,
          p.variants?.map(v => v.size).filter(Boolean),
        ].filter(Boolean);

        const productSizes = [];
        sizeSources.forEach(sizeSource => {
          if (Array.isArray(sizeSource)) {
            productSizes.push(...sizeSource.map(s => s?.trim()).filter(Boolean));
          } else if (sizeSource && sizeSource.trim()) {
            productSizes.push(sizeSource.trim());
          }
        });

        return filters.size.some(filterSize => productSizes.includes(filterSize));
      })
      .filter((p) => {
        if (filters.color.length === 0) return true;

        // Extract colors from multiple possible fields
        const colorSources = [
          p.colors,
          p.color,
          p.variants?.map(v => v.color).filter(Boolean),
          p.colour // alternative spelling
        ].filter(Boolean);

        const productColors = [];
        colorSources.forEach(colorSource => {
          if (Array.isArray(colorSource)) {
            productColors.push(...colorSource.map(c => c?.trim()).filter(Boolean));
          } else if (colorSource && typeof colorSource === 'string' && colorSource.trim()) {
            productColors.push(colorSource.trim());
          }
        });

        // Debug: Log color filtering
        const matches = filters.color.some(filterColor =>
          productColors.some(productColor =>
            productColor.toLowerCase().includes(filterColor.toLowerCase()) ||
            filterColor.toLowerCase().includes(productColor.toLowerCase())
          )
        );

        if (matches) {
          console.log('🎨 Product', p.name, 'matches color filter:', filters.color, 'Product colors:', productColors);
        }

        return matches;
      })
      .filter((p) => priceMatch(Number(p.price ?? 0)));
  }, [items, filters]);

  // --- sort
  const visibleProducts = useMemo(() => {
    const arr = [...filtered];
    switch (filters.sort) {
      case "plh": arr.sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0)); break;
      case "phl": arr.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0)); break;
      case "new": arr.sort((a, b) => new Date(b.date ?? 0) - new Date(a.date ?? 0)); break;
      default:    arr.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)); // "pop"
    }
    return arr;
  }, [filtered, filters.sort]);

  // facet options (derived from items, used for counts/labels)
  const facetOptions = useMemo(() => {
    const uniq = (arr) => Array.from(new Set(arr)).filter(Boolean);

    // Extract sizes from multiple possible fields
    const allSizes = items.flatMap((p) => {
      const sizes = [];
      if (Array.isArray(p.sizes)) {
        sizes.push(...p.sizes.map(s => s?.trim()).filter(Boolean));
      } else if (p.size) {
        sizes.push(p.size.trim());
      }
      if (p.variants && Array.isArray(p.variants)) {
        sizes.push(...p.variants.map(v => v.size?.trim()).filter(Boolean));
      }
      return sizes;
    });

    // Extract colors from multiple possible fields
    const allColors = items.flatMap((p) => {
      const colors = [];
      if (Array.isArray(p.colors)) {
        colors.push(...p.colors.map(c => c?.trim()).filter(Boolean));
      } else if (p.color) {
        colors.push(p.color.trim());
      }
      if (p.variants && Array.isArray(p.variants)) {
        colors.push(...p.variants.map(v => v.color?.trim()).filter(Boolean));
      }
      return colors;
    });

    return {
      types: uniq(items.map((p) => p.category)),
      sizes: uniq(allSizes),
      colors: uniq(allColors),
    };
  }, [items]);

  // Clear all filters
  const clearAllFilters = () => {
    setFilters(initialFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = filters.type.length > 0 || filters.size.length > 0 || filters.color.length > 0 || filters.price !== "ALL";

  return (
    <>
      <SEO
        title={currentSeo.title}
        description={currentSeo.description}
        keywords={currentSeo.keywords}
        image={currentSeo.image}
        type="category"
        canonical={`https://royalthread.co.in/${slug}`}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 md:pb-10">
        {/* Page Header */}
        <div className="text-center mt-4 sm:mt-6 md:mt-8 mb-4 sm:mb-6 md:mb-8">
          <h1 className="font-extrabold tracking-[.08em] text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-900 mb-2 sm:mb-3">
            {title}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-2 leading-relaxed">
            {currentSeo.description}
          </p>
        </div>

        {/* Filter Bar - Hidden on Mobile, Shown on Desktop */}
        <div className="hidden md:block">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            products={items}
            facetOptions={facetOptions}
            total={visibleProducts.length}
          />
        </div>

        {/* Mobile Top Filter Bar */}
        <div className="md:hidden flex items-center justify-between gap-3 py-3 px-0 border-b border-gray-200 bg-white mb-3">
          {/* Filter Button - Left Side */}
          <button
            onClick={() => setShowMobileFilterDrawer(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded flex-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="inline-block ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* View Mode Toggle - Right Side */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              aria-label="Grid view"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              aria-label="List view"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Results Header - Desktop Only */}
        <div className="hidden md:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mt-3 sm:mt-6 mb-2 sm:mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
            <span className="text-sm text-gray-600">
              {visibleProducts.length} of {items.length} products
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-900 hover:text-teal-700 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-10 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            <p className="mt-4 text-sm text-gray-500">Loading products...</p>
          </div>
        ) : visibleProducts.length === 0 ? (
          /* No Results State */
          <div className="py-10 text-center">
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
                className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-900 transition-colors text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          /* Products Grid/List */
          <section className={`mt-4 sm:mt-6 ${
            viewMode === 'grid' 
              ? 'grid gap-2 sm:gap-4 md:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-stretch' 
              : 'space-y-3 sm:space-y-4'
          }`}>
            {visibleProducts.map((p) => {
              // Ensure we use the slug from the page URL, not the product's category field
              // This guarantees the product navigation uses the correct category path
              return (
                <ProductCard
                  key={p.id ?? `${p.title}-${p.sku ?? Math.random()}`}
                  product={p}
                  category={slug}
                  viewMode={viewMode}
                  wishlistStatus={wishlistStatus[p.id] || false}
                  onWishlistChange={(productId, isWishlisted) => {
                    setWishlistStatus(prev => ({
                      ...prev,
                      [productId]: isWishlisted
                    }));
                  }}
                />
              );
            })}
          </section>
        )}

        {/* Pagination or Load More */}
        {visibleProducts.length > 0 && visibleProducts.length < items.length && (
          <div className="mt-8 text-center">
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-900 transition-colors">
              Load More Products
            </button>
          </div>
        )}
      </main>

      {/* Mobile Filter Drawer */}
      {showMobileFilterDrawer && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileFilterDrawer(false)}
          ></div>

          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">Filters & Sort</h2>
              <button
                onClick={() => setShowMobileFilterDrawer(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter Content */}
            <div className="p-4 space-y-4">
              {/* Sort by Section */}
              <div className="pb-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Sort by</h3>
                <div className="space-y-2">
                  {[
                    { value: 'pop', label: 'Popularity' },
                    { value: 'plh', label: 'Price: Low to High' },
                    { value: 'phl', label: 'Price: High to Low' },
                    { value: 'new', label: 'Newest First' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={filters.sort === option.value}
                        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Other Filters */}
              <FilterBar
                filters={filters}
                setFilters={setFilters}
                products={items}
                facetOptions={facetOptions}
                total={visibleProducts.length}
              />
            </div>

            {/* Footer Buttons */}
            <div className="sticky bottom-0 flex gap-3 p-4 border-t border-gray-200 bg-white">
              <button
                onClick={() => clearAllFilters()}
                className="flex-1 px-4 py-3 text-sm font-semibold text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowMobileFilterDrawer(false)}
                className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
