// services/productApi.js
import api from './api';

const productApi = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/products/getAll/');
      return response.data;
    } catch (error) {
      console.error('Get all products error:', error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Get products by category error:', error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await api.get('/products/featured');
      return response.data;
    } catch (error) {
      console.error('Get featured products error:', error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (query) => {
    try {
      const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  }
};

export default productApi;