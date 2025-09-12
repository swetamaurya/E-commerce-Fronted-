// services/api.js
import axios from 'axios';
import { API_URL } from '../config.js';
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
      console.log('Updating cart item via API:', { productId, quantity });
      const response = await api.put(`/cart/update/${productId}`, { quantity });
      console.log('Cart update API response:', response.data);
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

// Order API
export const orderApi = {
  // Get user's orders
  getOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get order details
  getOrderDetails: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  },
};

// Address API
export const addressApi = {
  // Get user's addresses
  getAddresses: async () => {
    try {
      const response = await api.get('/addresses');
      return response.data;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  },

  // Get default address
  getDefaultAddress: async () => {
    try {
      const response = await api.get('/addresses/default');
      return response.data;
    } catch (error) {
      console.error('Error fetching default address:', error);
      throw error;
    }
  },

  // Create new address
  createAddress: async (addressData) => {
    try {
      const response = await api.post('/addresses', addressData);
      return response.data;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },

  // Delete address
  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },

  // Set default address
  setDefaultAddress: async (addressId) => {
    try {
      const response = await api.patch(`/addresses/${addressId}/default`);
      return response.data;
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }
};

// Admin Order API
export const adminOrderApi = {
  // Get all orders for admin
  getAllOrders: async () => {
    try {
      const response = await api.get('/admin/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, statusData) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Get order details for admin
  getOrderDetails: async (orderId) => {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  // Get order statistics
  getOrderStats: async () => {
    try {
      const response = await api.get('/admin/orders/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }
};

// Real-time Order Updates (SSE)
export const orderSSE = {
  // Create SSE connection for order updates
  connect: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Add token as query parameter since EventSource doesn't support headers
    const eventSource = new EventSource(`${API_URL}/admin/orders/sse?token=${encodeURIComponent(token)}`);
    return eventSource;
  }
};

export default api;