// services/productApi.js
import api from './api';

// Simple cache to prevent duplicate API calls
const cache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`[Cache] Using cached data for: ${key}`);
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

const productApi = {
  // Get all products
  getAllProducts: async () => {
    try {
      const cacheKey = 'all_products';
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      console.log('[API] Fetching all products');
      const response = await api.get(`/products/getAll/?_t=${Date.now()}`);
      const data = response.data;
      
      // Cache the response
      setCachedData(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error('Get all products error:', error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const cacheKey = `category_${category}`;
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      console.log(`[API] Fetching products for category: ${category}`);
      const response = await api.get(`/products/category/${category}?_t=${Date.now()}`);
      const data = response.data;
      
      // Cache the response
      setCachedData(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error('Get products by category error:', error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const cacheKey = `product_${id}`;
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      console.log(`[API] Fetching product by ID: ${id}`);
      const response = await api.get(`/products/${id}?_t=${Date.now()}`);
      const data = response.data;
      
      // Cache the response
      setCachedData(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const cacheKey = 'featured_products';
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      console.log('[API] Fetching featured products');
      const response = await api.get(`/products/featured?_t=${Date.now()}`);
      const data = response.data;
      
      // Cache the response
      setCachedData(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error('Get featured products error:', error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (query) => {
    try {
      const response = await api.get(`/products/search?q=${encodeURIComponent(query)}&_t=${Date.now()}`);
      return response.data;
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  }
};

export default productApi;