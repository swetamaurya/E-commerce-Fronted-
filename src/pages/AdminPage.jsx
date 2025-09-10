import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaChartLine, FaBoxOpen, FaShoppingCart, FaTags, FaEye, FaCheck, FaTimes, FaUser, FaCreditCard, FaWarehouse, FaPrint } from 'react-icons/fa';
import adminApi from '../services/adminApi';

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [users, setUsers] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    mrp: '',
    category: '',
    description: '',
    images: [],
    stock: '',
    brand: 'Royal Thread',
    isActive: true,
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    variants: [],
    popularity: 80
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topSellingProducts: [],
    salesByCategory: {},
    recentSales: []
  });

  // Check admin role on component mount
  useEffect(() => {
    let isMounted = true;
    
    const checkAdminAccess = () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !user.role || user.role !== 'admin') {
        toast.error('Access denied. Admin role required.');
        navigate('/');
        return false;
      }
      return true;
    };

    if (!checkAdminAccess()) {
      return;
    }

    const fetchData = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [productsRes, ordersRes, paymentsRes, inventoryRes, usersRes] = await Promise.all([
          adminApi.getProducts(),
          adminApi.getOrders(),
          adminApi.getPayments(),
          adminApi.getInventory(),
          adminApi.getUsers()
        ]);
        
        if (!isMounted) return;
        
        setProducts(productsRes.data || []);
        setOrders(ordersRes.data || []);
        setPayments(paymentsRes.data || []);
        setInventory(inventoryRes.data || []);
        setUsers(usersRes.data || []);
        
        // Fetch sales data separately to avoid blocking
        try {
          const [salesRes, topProductsRes, salesByCategoryRes, recentSalesRes] = await Promise.all([
            adminApi.getSalesReport(),
            adminApi.getTopProducts(),
            adminApi.getSalesByCategory(),
            adminApi.getRecentSales()
          ]);
          
          if (!isMounted) return;
          
          setSalesData({
            totalSales: salesRes.data?.totalSales || 0,
            totalOrders: salesRes.data?.totalOrders || 0,
            averageOrderValue: salesRes.data?.averageOrderValue || 0,
            topSellingProducts: topProductsRes.data || [],
            salesByCategory: salesByCategoryRes.data || {},
            recentSales: recentSalesRes.data || []
          });
        } catch (salesError) {
          console.warn('Sales data fetch failed:', salesError);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Data fetch error:', error);
          toast.error('Error fetching data');
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
        fetchData();
      }
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  // Product management functions
  const handleSaveProduct = async () => {
    
    // Validate required fields
    if (!editingProduct.name?.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!editingProduct.price || editingProduct.price === '') {
      toast.error('Product price is required');
      return;
    }
    if (!editingProduct.category?.trim()) {
      toast.error('Product category is required');
      return;
    }
    if (editingProduct.stock === '' || editingProduct.stock === undefined) {
      toast.error('Product stock is required');
      return;
    }

    // Validate price is a number
    const numPrice = parseFloat(editingProduct.price);
    if (isNaN(numPrice) || numPrice <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    // Validate stock is a number
    const numStock = parseInt(editingProduct.stock);
    if (isNaN(numStock) || numStock < 0) {
      toast.error('Please enter a valid stock quantity');
      return;
    }

    // Validate MRP if provided
    if (editingProduct.mrp && (isNaN(parseFloat(editingProduct.mrp)) || parseFloat(editingProduct.mrp) <= 0)) {
      toast.error('Please enter a valid MRP');
      return;
    }

    setLoading(true);
    try {
      const productData = {
        name: editingProduct.name.trim(),
        description: editingProduct.description?.trim() || '',
        price: numPrice,
        mrp: editingProduct.mrp ? parseFloat(editingProduct.mrp) : numPrice * 1.5,
        stock: numStock,
        category: editingProduct.category.trim(),
        brand: editingProduct.brand?.trim() || 'Royal Thread',
        images: Array.isArray(editingProduct.images) ? 
          editingProduct.images.filter(img => img && typeof img === 'string' && img.trim()).map(img => img.trim()) : [],
        isActive: editingProduct.isActive !== undefined ? Boolean(editingProduct.isActive) : true,
        isFeatured: editingProduct.isFeatured !== undefined ? Boolean(editingProduct.isFeatured) : false,
        metaTitle: editingProduct.metaTitle?.trim() || '',
        metaDescription: editingProduct.metaDescription?.trim() || '',
        keywords: Array.isArray(editingProduct.keywords) ? editingProduct.keywords.filter(k => k && k.trim()).map(k => k.trim()) : [],
        variants: Array.isArray(editingProduct.variants) ? editingProduct.variants : [],
        popularity: editingProduct.popularity ? parseInt(editingProduct.popularity) : 80
      };


      if (editingProduct.id) {
        await adminApi.updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await adminApi.createProduct(productData);
        toast.success('Product created successfully');
      }
      
      // Reset form
      setEditingProduct(null);
      setNewProduct({
        name: '',
        price: '',
        mrp: '',
        category: '',
        description: '',
        images: [],
        stock: '',
        brand: 'Royal Thread',
        isActive: true,
        isFeatured: false,
        metaTitle: '',
        metaDescription: '',
        keywords: [],
        variants: [],
        popularity: 80
      });
      
      // Refresh products list
      try {
        const productsRes = await adminApi.getProducts();
        setProducts(productsRes.data || []);
      } catch (error) {
        console.error('Error refreshing products:', error);
        // Fallback: Update local state directly
        if (editingProduct.id) {
          setProducts(prevProducts => 
            prevProducts.map(p => 
              (p.id || p._id) === editingProduct.id 
                ? { ...p, ...productData, id: editingProduct.id }
                : p
            )
          );
        } else {
          setProducts(prevProducts => [...prevProducts, { ...productData, id: Date.now() }]);
        }
      }
    } catch (error) {
      console.error('Save product error:', error);
      
      // Handle specific error types
      if (error.response?.status === 400) {
        toast.error('Validation Error: ' + (error.response?.data?.message || error.message));
      } else if (error.response?.status === 500) {
        toast.error('Server Error: ' + (error.response?.data?.message || 'Please try again later'));
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        toast.error('Server not running. Please start the backend server.');
      } else {
        toast.error('Error saving product: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!productId) {
      toast.error('Product ID not found');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      try {
        await adminApi.deleteProduct(productId);
        toast.success('Product deleted successfully');
        // Update local state directly
        setProducts(prevProducts => 
          prevProducts.filter(p => (p.id || p._id) !== productId)
        );
      } catch (error) {
        console.error('Delete product error:', error);
        toast.error('Error deleting product: ' + (error.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewOrder = (orderId) => {
    // Navigate to order details or show modal
    toast.info(`Viewing order ${orderId}`);
  };

  const handleUpdateOrderStatus = (orderId) => {
    // Show status update modal or form
    toast.info(`Updating order ${orderId} status`);
  };

  const handleUpdateInventory = (itemId) => {
    // Show inventory update modal or form
    toast.info(`Updating inventory for item ${itemId}`);
  };

  // User management functions
  const handleToggleUserStatus = async (userId, isActive) => {
    if (!userId) {
      toast.error('User ID not found');
      return;
    }

    try {
      setLoading(true);
      await adminApi.updateUserStatus(userId, isActive);
      toast.success(`User ${isActive ? 'activated' : 'blocked'} successfully`);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          (user.id || user._id) === userId 
            ? { ...user, isActive } 
            : user
        )
      );
    } catch (error) {
      console.error('Toggle user status error:', error);
      toast.error('Error updating user status: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) {
      toast.error('User ID not found');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setLoading(true);
        await adminApi.deleteUser(userId);
        toast.success('User deleted successfully');
        
        // Update local state
        setUsers(prevUsers => 
          prevUsers.filter(user => (user.id || user._id) !== userId)
        );
      } catch (error) {
        console.error('Delete user error:', error);
        toast.error('Error deleting user: ' + (error.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    }
  };

  // Image upload functions
  // Image compression function
  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Please select only image files (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file sizes (max 10MB per file before compression)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast.error('File size should be less than 10MB');
      return;
    }

    setImageUploading(true);
    try {
      const imagePromises = files.map(async (file) => {
        // Compress image before converting to data URL
        const compressedDataUrl = await compressImage(file, 800, 0.7);
        return compressedDataUrl;
      });

      const imageUrls = await Promise.all(imagePromises);
      
      // Check total image limit (max 10 images)
      const currentImages = editingProduct.images || [];
      const totalImages = currentImages.length + imageUrls.length;
      
      if (totalImages > 10) {
        toast.error('Maximum 10 images allowed per product');
        return;
      }
      
      // Add images to the current editing product
      setEditingProduct(prev => ({
        ...prev,
        images: [...(prev.images || []), ...imageUrls]
      }));

      toast.success(`${files.length} image(s) added successfully`);
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Error uploading images: ' + error.message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setEditingProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleImageUrlAdd = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      // Check image limit
      const currentImages = editingProduct.images || [];
      if (currentImages.length >= 10) {
        toast.error('Maximum 10 images allowed per product');
        return;
      }
      
      // Basic URL validation
      try {
        new URL(url.trim());
        setEditingProduct(prev => ({
          ...prev,
          images: [...(prev.images || []), url.trim()]
        }));
        toast.success('Image URL added successfully');
      } catch (error) {
        toast.error('Please enter a valid URL');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your e-commerce platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaBoxOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaShoppingCart className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaUser className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaCreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">₹{salesData.totalSales.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaWarehouse className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                <p className="text-2xl font-semibold text-gray-900">{inventory.filter(item => item.stock < 10).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'products', name: 'Products', icon: FaBoxOpen },
              { id: 'orders', name: 'Orders', icon: FaShoppingCart },
              { id: 'payments', name: 'Payments', icon: FaCreditCard },
              { id: 'inventory', name: 'Inventory', icon: FaWarehouse },
              { id: 'users', name: 'Users', icon: FaUser },
              { id: 'reports', name: 'Reports', icon: FaChartLine }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Product Management</h2>
                <button
                  onClick={() => setEditingProduct({})}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <FaPlus className="h-4 w-4 mr-2" />
                  Add New Product
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Product Form */}
            {editingProduct && (
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingProduct.id ? 'Edit Product' : 'Add New Product'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                    <input
                      type="text"
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingProduct.price || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter price"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">MRP</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingProduct.mrp || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, mrp: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter MRP"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                    <select
                      value={editingProduct.category || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Cotton Yoga Mats">Cotton Yoga Mats</option>
                      <option value="Bath Mats">Bath Mats</option>
                      <option value="Area Rugs">Area Rugs</option>
                      <option value="Bedside Runners">Bedside Runners</option>
                      <option value="Mats Collection">Mats Collection</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock *</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={editingProduct.stock || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter stock quantity"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Brand</label>
                    <input
                      type="text"
                      value={editingProduct.brand || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                    <input
                      type="text"
                      value={editingProduct.metaTitle || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, metaTitle: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="SEO meta title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                    <textarea
                      value={editingProduct.metaDescription || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, metaDescription: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="SEO meta description"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Keywords (comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(editingProduct.keywords) ? editingProduct.keywords.join(', ') : ''}
                      onChange={(e) => setEditingProduct({...editingProduct, keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Popularity Score</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editingProduct.popularity || 80}
                      onChange={(e) => setEditingProduct({...editingProduct, popularity: parseInt(e.target.value) || 80})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="80"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={editingProduct.description || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Product Variants */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Variants</label>
                    <div className="space-y-2">
                      {Array.isArray(editingProduct.variants) && editingProduct.variants.length > 0 ? (
                        editingProduct.variants.map((variant, index) => (
                          <div key={index} className="flex gap-2 p-3 border border-gray-300 rounded-md bg-gray-50">
                            <input
                              type="text"
                              placeholder="Size (e.g., 2x3 ft)"
                              value={variant.size || ''}
                              onChange={(e) => {
                                const newVariants = [...editingProduct.variants];
                                newVariants[index] = { ...variant, size: e.target.value };
                                setEditingProduct({...editingProduct, variants: newVariants});
                              }}
                              className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Color (e.g., Blue)"
                              value={variant.color || ''}
                              onChange={(e) => {
                                const newVariants = [...editingProduct.variants];
                                newVariants[index] = { ...variant, color: e.target.value };
                                setEditingProduct({...editingProduct, variants: newVariants});
                              }}
                              className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
                            />
                            <input
                              type="number"
                              placeholder="Price"
                              value={variant.price || ''}
                              onChange={(e) => {
                                const newVariants = [...editingProduct.variants];
                                newVariants[index] = { ...variant, price: parseFloat(e.target.value) || 0 };
                                setEditingProduct({...editingProduct, variants: newVariants});
                              }}
                              className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
                            />
                            <input
                              type="number"
                              placeholder="Stock"
                              value={variant.stock || ''}
                              onChange={(e) => {
                                const newVariants = [...editingProduct.variants];
                                newVariants[index] = { ...variant, stock: parseInt(e.target.value) || 0 };
                                setEditingProduct({...editingProduct, variants: newVariants});
                              }}
                              className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
                            />
                            <input
                              type="text"
                              placeholder="SKU"
                              value={variant.sku || ''}
                              onChange={(e) => {
                                const newVariants = [...editingProduct.variants];
                                newVariants[index] = { ...variant, sku: e.target.value };
                                setEditingProduct({...editingProduct, variants: newVariants});
                              }}
                              className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newVariants = editingProduct.variants.filter((_, i) => i !== index);
                                setEditingProduct({...editingProduct, variants: newVariants});
                              }}
                              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                              title="Remove variant"
                            >
                              ×
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          No variants added yet. Click "Add Variant" to create product variations.
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const newVariants = [...(editingProduct.variants || []), { size: '', color: '', price: 0, stock: 0, sku: '' }];
                          setEditingProduct({...editingProduct, variants: newVariants});
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
                      >
                        + Add Variant
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Product Images</label>
                    
                    {/* Image Upload Buttons */}
                    <div className="mt-2 flex space-x-2">
                      <label className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                        (editingProduct.images?.length || 0) >= 10 
                          ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                          : 'text-gray-700 bg-white hover:bg-gray-50 cursor-pointer'
                      }`}>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={imageUploading || (editingProduct.images?.length || 0) >= 10}
                        />
                        {imageUploading ? 'Uploading...' : 
                         (editingProduct.images?.length || 0) >= 10 ? 'Max Images Reached' : 'Upload Images'}
                      </label>
                      
                      <button
                        type="button"
                        onClick={handleImageUrlAdd}
                        disabled={(editingProduct.images?.length || 0) >= 10}
                        className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                          (editingProduct.images?.length || 0) >= 10
                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                            : 'text-gray-700 bg-white hover:bg-gray-50'
                        }`}
                      >
                        Add URL
                      </button>
                    </div>

                    {/* Image Preview */}
                    {editingProduct.images && editingProduct.images.length > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">
                            Images ({editingProduct.images.length}/10)
                          </span>
                          {editingProduct.images.length >= 10 && (
                            <span className="text-sm text-red-600">Maximum reached</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {editingProduct.images.map((image, index) => {
                          // Handle both string URLs and object format
                          const imageUrl = typeof image === 'string' ? image : (image?.url || image?.thumbnail || '');
                          const imageAlt = typeof image === 'string' ? `Product ${index + 1}` : (image?.alt || `Product ${index + 1}`);
                          
                          // Skip empty images or invalid URLs
                          if (!imageUrl || imageUrl.trim() === '') return null;
                          
                          return (
                            <div key={index} className="relative group">
                              <img
                                src={imageUrl}
                                alt={imageAlt}
                                className="w-full h-24 object-cover rounded border"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div 
                                className="w-full h-24 bg-gray-100 rounded border hidden items-center justify-center"
                                style={{display: 'none'}}
                              >
                                <span className="text-gray-500 text-sm">Image {index + 1}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          );
                        }).filter(Boolean)}
                        </div>
                      </div>
                    )}

                    {/* Manual URL Input */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Or enter URLs manually (one per line)</label>
                      <textarea
                        value={Array.isArray(editingProduct.images) ? 
                          editingProduct.images.map(img => typeof img === 'string' ? img : (img?.url || '')).join('\n') : ''}
                        onChange={(e) => {
                          const urls = e.target.value.split('\n').filter(url => url.trim());
                          setEditingProduct({...editingProduct, images: urls});
                        }}
                        rows={3}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex flex-wrap gap-6 p-4 bg-gray-50 rounded-md">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editingProduct.isActive !== undefined ? editingProduct.isActive : true}
                          onChange={(e) => setEditingProduct({...editingProduct, isActive: e.target.checked})}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Active Product</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editingProduct.isFeatured !== undefined ? editingProduct.isFeatured : false}
                          onChange={(e) => setEditingProduct({...editingProduct, isFeatured: e.target.checked})}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Featured Product</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingProduct.id ? 'Update Product' : 'Add Product')}
                  </button>
                </div>
              </div>
            )}

            {/* Product List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.filter(product => 
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.category.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((product, index) => (
                    <tr key={product.id || `product-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="h-12 w-12 object-cover rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center" style={{display: product.images && product.images.length > 0 ? 'none' : 'flex'}}>
                          <FaBoxOpen className="h-6 w-6 text-gray-400" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.stock < 10 ? 'bg-red-100 text-red-800' : 
                          product.stock < 50 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            // Handle images properly - convert objects to strings if needed
                            let processedImages = [];
                            if (Array.isArray(product.images)) {
                              processedImages = product.images.map(img => {
                                if (typeof img === 'string') {
                                  return img.trim() !== '' ? img : null;
                                } else if (img && typeof img === 'object') {
                                  const url = img.url || img.thumbnail || '';
                                  return url.trim() !== '' ? url : null;
                                }
                                return null;
                              }).filter(img => img && img.trim() !== '');
                            }
                            
                            setEditingProduct({
                              id: product.id || product._id,
                              name: product.name || '',
                              price: product.price || '',
                              mrp: product.mrp || '',
                              category: product.category || '',
                              description: product.description || '',
                              images: processedImages,
                              stock: product.stock || 0,
                              brand: product.brand || 'Royal Thread',
                              isActive: product.isActive !== undefined ? product.isActive : true,
                              isFeatured: product.isFeatured !== undefined ? product.isFeatured : false,
                              metaTitle: product.metaTitle || '',
                              metaDescription: product.metaDescription || '',
                              keywords: product.keywords || [],
                              variants: product.variants || [],
                              popularity: product.popularity || 80
                            });
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Edit"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id || product._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Order Management</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => {/* Add create order functionality */}}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  + Create Order
                </button>
                <button
                  onClick={() => {/* Add refresh functionality */}}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium"
                >
                  Refresh
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id || order._id || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.customerName || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{order.customerEmail || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.items ? `${order.items.length} item(s)` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{order.totalAmount || order.total || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                            order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.paymentStatus || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.date ? new Date(order.date).toLocaleDateString() : 
                           order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewOrder(order.id || order._id)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="View Details"
                            >
                              <FaEye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id || order._id)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                              title="Update Status"
                            >
                              <FaEdit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {/* Add print functionality */}}
                              className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                              title="Print Order"
                            >
                              <FaPrint className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <FaShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
                          <p className="text-lg font-medium text-gray-900 mb-2">No orders found</p>
                          <p className="text-sm text-gray-500">Orders will appear here when customers place them.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Payment Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.orderId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payment.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.method}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          payment.status === 'success' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <div className="text-sm text-gray-500">
                Total Users: {users.length} | Active: {users.filter(u => u.isActive).length} | Blocked: {users.filter(u => !u.isActive).length}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user, index) => (
                      <tr key={user.id || user._id || `user-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">ID: {user.id || user._id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.mobile || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Active' : 'Blocked'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleToggleUserStatus(user.id || user._id, !user.isActive)}
                            className={`px-3 py-1 text-xs font-medium rounded ${
                              user.isActive
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                            disabled={loading}
                          >
                            {user.isActive ? 'Block' : 'Unblock'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id || user._id)}
                            className="px-3 py-1 text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Inventory Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.currentStock}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.minStock}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.currentStock < item.minStock ? 'bg-red-100 text-red-800' :
                          item.currentStock < item.minStock * 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.currentStock < item.minStock ? 'Low Stock' :
                           item.currentStock < item.minStock * 2 ? 'Medium Stock' : 'Good Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(item.lastUpdated).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleUpdateInventory(item.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Update Stock"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Top Selling Products</h3>
                <div className="space-y-2">
                  {salesData.topSellingProducts.map((product, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm text-gray-600">{product.name}</span>
                      <span className="text-sm font-medium text-gray-900">{product.sales} sold</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sales by Category</h3>
                <div className="space-y-2">
                  {Object.entries(salesData.salesByCategory).map(([category, amount]) => (
                    <div key={category} className="flex justify-between">
                      <span className="text-sm text-gray-600">{category}</span>
                      <span className="text-sm font-medium text-gray-900">₹{amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;