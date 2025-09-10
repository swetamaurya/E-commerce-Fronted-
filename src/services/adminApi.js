import api from './api';

// Cache for API responses
const apiCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

// Helper function to get cached data
const getCachedData = (key) => {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

// Helper function to set cached data
const setCachedData = (key, data) => {
  apiCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

const adminApi = {
  // Product Management - Use same API as users but with admin role
  getProducts: async () => {
    const cacheKey = 'products';
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await api.get('/products/getAll');
      const data = response.data;
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/products/create', productData);
      // Clear products cache after creating
      apiCache.delete('products');
      return response.data;
    } catch (error) {
      console.error('Create product error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/products/update/${productId}`, productData);
      // Clear products cache after updating
      apiCache.delete('products');
      return response.data;
    } catch (error) {
      console.error('Update product error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/delete/${productId}`);
      // Clear products cache after deleting
      apiCache.delete('products');
      return response.data;
    } catch (error) {
      console.error('Delete product error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  },

  // Dashboard
  // getDashboard: async () => {
  //   const cacheKey = 'dashboard';
  //   const cachedData = getCachedData(cacheKey);
  //   if (cachedData) {
  //     return cachedData;
  //   }

  //   try {
  //     const response = await api.get('/admin/dashboard');
  //     const data = response.data;
  //     setCachedData(cacheKey, data);
  //     return data;
  //   } catch (error) {
  //     console.error('Get dashboard error:', error);
  //     throw error;
  //   }
  // },

  // Orders
  getOrders: async () => {
    const cacheKey = 'orders';
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await api.get('/admin/orders');
      const data = response.data;
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
      // Clear orders cache after updating
      apiCache.delete('orders');
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
  },

  // Payments
  getPayments: async () => {
    const cacheKey = 'payments';
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await api.get('/admin/payments');
      const data = response.data;
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Get payments error:', error);
      throw error;
    }
  },

  // Inventory
  getInventory: async () => {
    const cacheKey = 'inventory';
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await api.get('/admin/inventory');
      const data = response.data;
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Get inventory error:', error);
      throw error;
    }
  },

  updateInventory: async (productId, stock) => {
    try {
      const response = await api.patch(`/admin/products/${productId}/inventory`, { stock });
      // Clear inventory cache after updating
      apiCache.delete('inventory');
      return response.data;
    } catch (error) {
      console.error('Update inventory error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update inventory');
    }
  },
  
  // Reports
  getSalesReport: async () => {
    const cacheKey = 'salesReport';
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await api.get('/admin/reports/sales');
      const data = response.data;
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Get sales report error:', error);
      throw error;
    }
  },

  getTopProducts: async () => {
    const cacheKey = 'topProducts';
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await api.get('/admin/reports/top-products');
      const data = response.data;
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Get top products error:', error);
      throw error;
    }
  },

  getSalesByCategory: async () => {
    const cacheKey = 'salesByCategory';
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await api.get('/admin/reports/sales-by-category');
      const data = response.data;
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Get sales by category error:', error);
      throw error;
    }
  },

  getRecentSales: async () => {
    const cacheKey = 'recentSales';
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await api.get('/admin/reports/recent-sales');
      const data = response.data;
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Get recent sales error:', error);
      throw error;
    }
  },

  // Users
  getUsers: async () => {
    const cacheKey = 'users';
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await api.get('/admin/users');
      const data = response.data;
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  },

  updateUserStatus: async (userId, isActive) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, { isActive });
      // Clear users cache after updating
      apiCache.delete('users');
      return response.data;
    } catch (error) {
      console.error('Update user status error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update user status');
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      // Clear users cache after deleting
      apiCache.delete('users');
      return response.data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }
};

export default adminApi;