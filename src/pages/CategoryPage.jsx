import { useEffect, useMemo, useState } from "react";
import { listProducts } from "../../products";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import SEO from "../components/SEO";

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

  // SEO data for each category
  const seoData = {
    'cotton-yoga-mats': {
      title: 'Cotton Yoga Mats - Premium Handmade Yoga Mats | Royal Thread',
      description: 'Discover premium cotton yoga mats for comfortable practice. Handcrafted with love, perfect for yoga, meditation, and wellness. Shop now for the best quality.',
      keywords: 'cotton yoga mats, handmade yoga mats, premium yoga mats, meditation mats, wellness products',
      image: '/images/cotton-yoga-mats.jpg'
    },
    'bedside-runners': {
      title: 'Bedside Runners - Elegant Bedroom Decor | Royal Thread',
      description: 'Beautiful bedside runners to enhance your bedroom decor. Handcrafted with premium materials for elegance and comfort.',
      keywords: 'bedside runners, bedroom decor, home textiles, handmade rugs, bedroom accessories',
      image: '/images/bedside-runners.jpg'
    },
    'mats-collection': {
      title: 'Mats Collection - Complete Home & Yoga Mats | Royal Thread',
      description: 'Complete collection of home and yoga mats. From meditation to decoration, find the perfect mat for every space.',
      keywords: 'mats collection, home mats, yoga mats, meditation mats, decorative mats',
      image: '/images/mats-collection.jpg'
    },
    'bath-mats': {
      title: 'Bath Mats - Luxurious Bathroom Comfort | Royal Thread',
      description: 'Luxurious bath mats for ultimate bathroom comfort. Soft, absorbent, and beautifully designed for your bathroom.',
      keywords: 'bath mats, bathroom accessories, luxury bath mats, soft bath mats, bathroom comfort',
      image: '/images/bath-mats.jpg'
    },
    'area-rugs': {
      title: 'Area Rugs - Beautiful Home Decoration | Royal Thread',
      description: 'Beautiful area rugs to transform your home decoration. Handcrafted designs that add warmth and style to any room.',
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

  useEffect(() => {
    let alive = true;
    setLoading(true);
    listProducts(slug).then((data) => {
      if (!alive) return;
      setItems(Array.isArray(data) ? data : []);
      setLoading(false);
    });
    return () => { alive = false; };
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
      .filter((p) => inSel(filters.type, p.type))
      .filter((p) => inSel(filters.size, p.size))
      .filter((p) => inSel(filters.color, p.color))
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
    return {
      types: uniq(items.map((p) => p.type)),
      sizes: uniq(items.map((p) => p.size)),
      colors: uniq(items.map((p) => p.color)),
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
      
      <main className="max-w-[1150px] mx-auto px-3 sm:px-4 md:px-6 pb-10">
        {/* Page Header */}
        <div className="text-center mt-6 mb-6">
          <h1 className="font-extrabold tracking-[.08em] text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-2">
            {title}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            {currentSeo.description}
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          products={items}
          facetOptions={facetOptions}
          total={visibleProducts.length}
        />

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 mb-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {visibleProducts.length} of {items.length} products
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
          <div className="flex items-center gap-2">
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
            <p className="mt-4 text-gray-500">Loading products...</p>
          </div>
        ) : visibleProducts.length === 0 ? (
          /* No Results State */
          <div className="py-20 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"/>
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-2 text-gray-500">
              {hasActiveFilters 
                ? "Try adjusting your filters or search terms."
                : "We couldn't find any products in this category."
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
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
                key={p.id ?? `${p.title}-${p.sku ?? Math.random()}`} 
                product={p}
                viewMode={viewMode}
              />
            ))}
          </section>
        )}

        {/* Pagination or Load More */}
        {visibleProducts.length > 0 && visibleProducts.length < items.length && (
          <div className="mt-8 text-center">
            <button className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
              Load More Products
            </button>
          </div>
        )}
      </main>
    </>
  );
}
