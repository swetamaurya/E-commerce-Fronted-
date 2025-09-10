// services/api.js
import axios from 'axios';

// const API_URL = 'http://localhost:5002/api';
const API_URL = 'https://e-commerce-backend-r6s0.onrender.com/api';
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Cart API
export const cartApi = {
  // Get user's cart
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (productData) => {
    try {
      const response = await api.post('/cart/add', productData);
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    try {
      // यदि productId undefined है तो एरर थ्रो करें
      if (!productId) {
        throw new Error('Product ID is required');
      }
      
      const response = await api.delete(`/cart/remove/${productId}`);
      
      // यदि रिस्पॉन्स में एरर है तो एरर थ्रो करें
      if (response.status >= 400) {
        throw new Error(`Error removing item from cart: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Update item quantity in cart
  updateCartItem: async (productId, quantity) => {
    try {
      const response = await api.put(`/cart/update/${productId}`, { quantity });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart/clear');
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },
};

// Wishlist API
export const wishlistApi = {
  // Get user's wishlist
  getWishlist: async () => {
    try {
      const response = await api.get('/wishlist');
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },

  // Add item to wishlist
  addToWishlist: async (productData) => {
    try {
      const response = await api.post('/wishlist/add', productData);
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  // Remove item from wishlist
  removeFromWishlist: async (productId) => {
    try {
      const response = await api.delete(`/wishlist/remove/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  // Check if item is in wishlist
  checkWishlistItem: async (productId) => {
    try {
      const response = await api.get(`/wishlist/check/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking wishlist item:', error);
      throw error;
    }
  },

  // Clear wishlist
  clearWishlist: async () => {
    try {
      const response = await api.delete('/wishlist/clear');
      return response.data;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  },
};

export default api;