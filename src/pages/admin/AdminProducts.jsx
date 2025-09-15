import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaEye, FaChevronLeft, FaChevronRight, FaTimes, FaUpload, FaBoxOpen } from 'react-icons/fa';
import adminApi from '../../services/adminApi';
import { getImageUrl } from '../../utils/imageUtils';

const CATEGORY_OPTIONS = [
  'Area Rugs',
  'Bath Mats', 
  'Bedside Runners',
  'Cotton Yoga Mats',
  'Mats Collection',
  'In Door Mats',
  'Out Door Mats',
  'Other'
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pagination, setPagination] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  const [colorInputValue, setColorInputValue] = useState('');
  const [sizeInputValue, setSizeInputValue] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const colorInputRef = useRef(null);
  const sizeInputRef = useRef(null);
  const editColorInputRef = useRef(null);
  const editSizeInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    brand: 'Royal Thread',
    meterial: '',
    price: '',
    mrp: '',
    stock: '',
    specialFeature: '',
    images: [],
    colors: [],
    sizes: [],
    isActive: true,
    isFeatured: false
  });

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);


  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);


  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getProducts(currentPage, 5, searchTerm);
      setProducts(response.data || []);
      setPagination(response.pagination || {});
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalProducts(response.pagination?.totalProducts || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    // Frontend validation
    if (!newProduct.name.trim()) {
      alert('Product name is required');
      return;
    }
    if (!newProduct.description.trim()) {
      alert('Product description is required');
      return;
    }
    if (!newProduct.meterial.trim()) {
      alert('Product material is required');
      return;
    }
    if (!newProduct.price || newProduct.price <= 0) {
      alert('Valid price is required');
      return;
    }
    if (!newProduct.stock || newProduct.stock <= 0) {
      alert('Valid stock quantity is required');
      return;
    }
    if (!newProduct.images || newProduct.images.length === 0) {
      alert('At least one product image is required');
      return;
    }
    
    // Check for any pending input field values and add them
    const pendingColor = colorInputValue.trim();
    const pendingSize = sizeInputValue.trim();
    
    let finalColors = [...(newProduct.colors || [])];
    let finalSizes = [...(newProduct.sizes || [])];
    
    // Add pending color if exists
    if (pendingColor) {
      finalColors.push(pendingColor);
      console.log('Adding pending color:', pendingColor);
    }
    
    // Add pending size if exists
    if (pendingSize) {
      finalSizes.push(pendingSize);
      console.log('Adding pending size:', pendingSize);
    }
    
    // Clean up colors and sizes arrays
    const cleanProduct = {
      ...newProduct,
      colors: finalColors.filter(color => color && color.trim()),
      sizes: finalSizes.filter(size => size && size.trim())
    };
    
    
    try {
      await adminApi.createProduct(cleanProduct);
      
      // Close modal and reset form
      setShowAddModal(false);
      setColorInputValue('');
      setSizeInputValue('');
      setNewProduct({
        name: '',
        description: '',
        category: '',
        brand: 'Royal Thread',
        meterial: '',
        price: '',
        mrp: '',
        stock: '',
        specialFeature: '',
        images: [],
        colors: [],
        sizes: [],
        isActive: true,
        isFeatured: false
      });
      
      // Refresh the page to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product: ' + (error.message || 'Unknown error'));
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    
    // Frontend validation
    if (!editingProduct.name.trim()) {
      alert('Product name is required');
      return;
    }
    if (!editingProduct.description.trim()) {
      alert('Product description is required');
      return;
    }
    if (!editingProduct.meterial.trim()) {
      alert('Product material is required');
      return;
    }
    if (!editingProduct.price || editingProduct.price <= 0) {
      alert('Valid price is required');
      return;
    }
    if (!editingProduct.stock || editingProduct.stock <= 0) {
      alert('Valid stock quantity is required');
      return;
    }
    if (!editingProduct.images || editingProduct.images.length === 0) {
      alert('At least one product image is required');
      return;
    }
    
    // Check for any pending input field values and add them
    const pendingEditColor = editColorInputRef.current?.value?.trim();
    const pendingEditSize = editSizeInputRef.current?.value?.trim();
    
    let finalEditColors = [...(editingProduct.colors || [])];
    let finalEditSizes = [...(editingProduct.sizes || [])];
    
    // Add pending color if exists
    if (pendingEditColor) {
      finalEditColors.push(pendingEditColor);
      console.log('Edit - Adding pending color:', pendingEditColor);
    }
    
    // Add pending size if exists
    if (pendingEditSize) {
      finalEditSizes.push(pendingEditSize);
      console.log('Edit - Adding pending size:', pendingEditSize);
    }
    
    // Clean up colors and sizes arrays
    const cleanEditingProduct = {
      ...editingProduct,
      colors: finalEditColors.filter(color => color && color.trim()),
      sizes: finalEditSizes.filter(size => size && size.trim())
    };

    // Debug: Log data being sent to backend
    console.log('=== EDIT PRODUCT - SENDING DATA ===');
    console.log('Product ID:', editingProduct._id);
    console.log('Images being sent:', JSON.stringify(cleanEditingProduct.images, null, 2));
    console.log('Primary images:', cleanEditingProduct.images?.filter(img => img.isPrimary === true));
    
    try {
      await adminApi.updateProduct(editingProduct._id, cleanEditingProduct);
      
      // Close modal and reset form
      setEditingProduct(null);
      if (editColorInputRef.current) editColorInputRef.current.value = '';
      if (editSizeInputRef.current) editSizeInputRef.current.value = '';
      
      // Clear all cache and force refresh product data
      if (window.adminApiCache) {
        window.adminApiCache.clear();
      }
      await fetchProducts();
      
      // Force browser cache clear and refresh
      setTimeout(() => {
        // Clear browser cache
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => {
              caches.delete(name);
            });
          });
        }
        // Force reload with cache bypass
        window.location.reload(true);
      }, 1000);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await adminApi.deleteProduct(productToDelete._id);
        // Refresh the page to ensure clean state
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + (error.message || 'Unknown error'));
      }
    }
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const cancelDeleteProduct = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value); // Update local state immediately

    // Show searching indicator
    if (value.trim()) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      setSearchTerm(value); // Update actual search term after delay
      setCurrentPage(1); // Reset to first page when searching
      setIsSearching(false);
    }, 500); // 500ms delay for better UX

    setSearchTimeout(timeout);
  };

  // Image management functions
  const handleImageUpload = async (product, file) => {
    if (!file) return Promise.reject('No file provided');
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      const error = 'File size too large. Please select an image smaller than 10MB.';
      alert(error);
      return Promise.reject(error);
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      const error = 'Please select a valid image file.';
      alert(error);
      return Promise.reject(error);
    }
    
    return new Promise((resolve, reject) => {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target.result;
        
        try {
          const response = await adminApi.uploadImage(imageData, file.name);
          const newImage = {
            url: response.data.url,
            alt: product.name || 'Product image',
            isPrimary: product.images.length === 0
          };
          
          // Update state based on which product we're working with
          if (product === newProduct) {
            setNewProduct(prevProduct => ({
              ...prevProduct,
              images: [...prevProduct.images, newImage]
            }));
          } else if (product === editingProduct) {
            setEditingProduct(prevProduct => ({
              ...prevProduct,
              images: [...prevProduct.images, newImage]
            }));
          } else {
            setEditingProduct(prevProduct => ({
              ...prevProduct,
              images: [...prevProduct.images, newImage]
            }));
          }
          
          // Show success message
          console.log('Image uploaded successfully:', file.name);
          resolve(response.data);
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image: ' + error.message);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        const error = 'Failed to process image file';
        alert(error);
        reject(error);
      };
      
      reader.readAsDataURL(file);
    });
  };


  const handleImageRemove = (product, index) => {
    const updatedProduct = {
      ...product,
      images: product.images.filter((_, i) => i !== index)
    };
    if (product === newProduct) {
      setNewProduct(updatedProduct);
    } else if (product === editingProduct) {
      setEditingProduct(updatedProduct);
    } else {
      setEditingProduct(updatedProduct);
    }
  };

  const handleImageSetPrimary = (product, index) => {
    const updatedImages = product.images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    
    const updatedProduct = {
      ...product,
      images: updatedImages
    };
    
    if (product === newProduct) {
      setNewProduct(updatedProduct);
    } else if (product === editingProduct) {
      setEditingProduct(updatedProduct);
    } else {
      setEditingProduct(updatedProduct);
    }
  };

  // Colors and Sizes management functions
  const handleColorAdd = (product, color) => {
    if (color && color.trim()) {
      if (product === newProduct) {
        setNewProduct(prevProduct => ({
          ...prevProduct,
          colors: [...(prevProduct.colors || []), color.trim()]
        }));
      } else {
        setEditingProduct(prevProduct => ({
          ...prevProduct,
          colors: [...(prevProduct.colors || []), color.trim()]
        }));
      }
    }
  };

  const handleColorRemove = (product, index) => {
    if (product === newProduct) {
      setNewProduct(prevProduct => ({
        ...prevProduct,
        colors: prevProduct.colors.filter((_, i) => i !== index)
      }));
    } else {
      setEditingProduct(prevProduct => ({
        ...prevProduct,
        colors: prevProduct.colors.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSizeAdd = (product, size) => {
    if (size && size.trim()) {
      if (product === newProduct) {
        setNewProduct(prevProduct => ({
          ...prevProduct,
          sizes: [...(prevProduct.sizes || []), size.trim()]
        }));
      } else {
        setEditingProduct(prevProduct => ({
          ...prevProduct,
          sizes: [...(prevProduct.sizes || []), size.trim()]
        }));
      }
    }
  };

  const handleSizeRemove = (product, index) => {
    if (product === newProduct) {
      setNewProduct(prevProduct => ({
        ...prevProduct,
        sizes: prevProduct.sizes.filter((_, i) => i !== index)
      }));
    } else {
      setEditingProduct(prevProduct => ({
        ...prevProduct,
        sizes: prevProduct.sizes.filter((_, i) => i !== index)
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section - Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Products Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your product inventory</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="text-xs sm:text-sm text-gray-500">
            Total Products: {totalProducts}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <FaPlus className="w-4 h-4" />
            <span className="hidden xs:inline">Add Product</span>
            <span className="xs:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Search Bar - Responsive */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search products by name, category, brand, SKU..."
            value={localSearchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            autoComplete="off"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        {localSearchTerm && (
          <div className="mt-2 text-sm text-gray-500">
            Searching for: "{localSearchTerm}"
          </div>
        )}
      </div>

      {/* Products Table - Responsive */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {product.images && product.images.length > 0 ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={getImageUrl(typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url)}
                            alt={product.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FaBoxOpen className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.brand}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{product.price}
                    {product.mrp && product.mrp > product.price && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ₹{product.mrp}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded">
                      {product.sku || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {product.isFeatured && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-3">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              {/* Product Content */}
              <div className="p-3">
                <div className="flex items-center space-x-3">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={getImageUrl(product.images[0].url)}
                            alt={product.images[0].alt || product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <FaBoxOpen className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      {/* Status Badge */}
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        product.isActive ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1 truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">
                          {product.category}
                        </p>
                        
                        {/* Price and Stock */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-gray-900">
                              ₹{product.price.toLocaleString()}
                            </span>
                            {product.mrp && product.mrp > product.price && (
                              <span className="text-xs text-gray-500 line-through">
                                ₹{product.mrp.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            Stock: {product.stock}
                          </span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col space-y-1 ml-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors duration-200"
                          title="Edit Product"
                        >
                          <FaEdit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                          title="Delete Product"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Status Row */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      SKU: {product.sku || 'N/A'}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      product.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {product.isFeatured && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination - Responsive */}
      <div className="bg-white px-3 sm:px-4 py-3 border-t border-gray-200">
        {/* Mobile Pagination */}
        <div className="flex flex-col space-y-3 sm:hidden">
          {/* Mobile Info */}
          <div className="text-center">
            <p className="text-xs text-gray-700">
              Showing <span className="font-medium">{((currentPage - 1) * 5) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * 5, totalProducts)}
              </span>{' '}
              of <span className="font-medium">{totalProducts}</span> results
            </p>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="flex items-center px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <FaChevronLeft className="w-3 h-3 mr-1" />
              Previous
            </button>
            
            {/* Current Page Indicator */}
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">Page</span>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                {currentPage}
              </span>
              <span className="text-xs text-gray-500">of {totalPages}</span>
            </div>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="flex items-center px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              Next
              <FaChevronRight className="w-3 h-3 ml-1" />
            </button>
          </div>
          
          {/* Mobile Page Numbers (if total pages <= 5) */}
          {totalPages <= 5 && totalPages > 1 && (
            <div className="flex justify-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-xs font-medium rounded ${
                      pageNum === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{((currentPage - 1) * 5) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * 5, totalProducts)}
              </span>{' '}
              of <span className="font-medium">{totalProducts}</span> results
            </p>
          </div>
          <div>
            {totalPages > 1 ? (
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="h-5 w-5" />
                </button>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight className="h-5 w-5" />
                </button>
              </nav>
            ) : (
              <div className="text-sm text-gray-500">
                Page 1 of 1
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setShowAddModal(false);
            setColorInputValue('');
            setSizeInputValue('');
          }}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {CATEGORY_OPTIONS.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Brand</label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Material *</label>
                  <input
                    type="text"
                    value={newProduct.meterial}
                    onChange={(e) => setNewProduct({...newProduct, meterial: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Pricing and Inventory */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">MRP</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.mrp}
                    onChange={(e) => setNewProduct({...newProduct, mrp: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock *</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Special Feature</label>
                <input
                  type="text"
                  value={newProduct.specialFeature}
                  onChange={(e) => setNewProduct({...newProduct, specialFeature: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Waterproof, Anti-slip, etc."
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Images {newProduct.images.length > 0 && `(${newProduct.images.length} uploaded)`}
                </label>
                <div className="mt-2 space-y-2">
                  {newProduct.images.length > 0 ? (
                    newProduct.images.map((image, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg">
                        <div className="relative">
                          <img 
                            src={getImageUrl(image.url)} 
                            alt={image.alt} 
                            className="w-16 h-16 object-cover rounded border" 
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTI4IDI4TDQ0IDQ0IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik00NCAyOEwyOCA0NCIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                            }}
                          />
                          {image.isPrimary === true && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-full">
                              ★
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-600">
                            Image {index + 1}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {image.url.split('/').pop() || 'Uploaded image'}
                          </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          type="button"
                          onClick={() => {
                            // Functional update for add modal
                            setNewProduct(prevProduct => {
                              const updatedImages = prevProduct.images.map((img, i) => ({
                                ...img,
                                isPrimary: i === index
                              }));
                              
                              setForceUpdate(prev => prev + 1); // Force re-render
                              return {
                                ...prevProduct,
                                images: updatedImages
                              };
                            });
                          }}
                          className={`px-2 py-1 text-xs rounded ${
                            image.isPrimary === true
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {image.isPrimary === true ? 'Primary' : 'Set Primary'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleImageRemove(newProduct, index)}
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No images uploaded yet. Please upload at least one image.
                    </div>
                  )}
                  
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                    <div className="text-center">
                      <FaUpload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="mt-2">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            {newProduct.images.length > 0 ? 'Add More Images' : 'Upload Images'}
                          </span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            multiple
                            onChange={async (e) => {
                              const files = Array.from(e.target.files);
                              if (files.length > 0) {
                                setIsUploading(true);
                                try {
                                  // Upload files sequentially to avoid race conditions
                                  for (const file of files) {
                                    await handleImageUpload(newProduct, file);
                                  }
                                } catch (error) {
                                  console.error('Upload error:', error);
                                } finally {
                                  setIsUploading(false);
                                  // Reset input after upload
                                  e.target.value = '';
                                }
                              }
                            }}
                          />
                        </label>
                        <p className="mt-1 text-xs text-gray-500">
                          {isUploading ? 'Uploading images...' : `PNG, JPG, GIF up to 10MB each • ${newProduct.images.length === 0 ? 'At least 1 image required' : 'Multiple images allowed'}`}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Available Colors ({newProduct.colors?.length || 0})
                </label>
                <div className="mt-2 space-y-2">
                  {newProduct.colors?.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-gray-100 rounded text-sm">{color}</span>
                      <button
                        type="button"
                        onClick={() => handleColorRemove(newProduct, index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )) || <div className="text-gray-500 text-sm">No colors added yet</div>}
                  <div className="flex items-center space-x-2">
                    <input
                      ref={colorInputRef}
                      type="text"
                      value={colorInputValue}
                      onChange={(e) => setColorInputValue(e.target.value)}
                      placeholder="Add color (e.g., Blue, Red, Green)"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const value = colorInputValue.trim();
                          if (value) {
                            setNewProduct(prevProduct => ({
                              ...prevProduct,
                              colors: [...(prevProduct.colors || []), value]
                            }));
                            setColorInputValue('');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const inputValue = colorInputValue.trim();
                        if (inputValue) {
                          setNewProduct(prevProduct => ({
                            ...prevProduct,
                            colors: [...(prevProduct.colors || []), inputValue]
                          }));
                          setColorInputValue('');
                        }
                      }}
                      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Available Sizes ({newProduct.sizes?.length || 0})
                </label>
                <div className="mt-2 space-y-2">
                  {newProduct.sizes?.map((size, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-gray-100 rounded text-sm">{size}</span>
                      <button
                        type="button"
                        onClick={() => handleSizeRemove(newProduct, index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )) || <div className="text-gray-500 text-sm">No sizes added yet</div>}
                  <div className="flex items-center space-x-2">
                    <input
                      ref={sizeInputRef}
                      type="text"
                      value={sizeInputValue}
                      onChange={(e) => setSizeInputValue(e.target.value)}
                      placeholder="Add size (e.g., Small, Medium, Large)"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const value = sizeInputValue.trim();
                          if (value) {
                            setNewProduct(prevProduct => ({
                              ...prevProduct,
                              sizes: [...(prevProduct.sizes || []), value]
                            }));
                            setSizeInputValue('');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const inputValue = sizeInputValue.trim();
                        if (inputValue) {
                          setNewProduct(prevProduct => ({
                            ...prevProduct,
                            sizes: [...(prevProduct.sizes || []), inputValue]
                          }));
                          setSizeInputValue('');
                        }
                      }}
                      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newProduct.isActive}
                    onChange={(e) => setNewProduct({...newProduct, isActive: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newProduct.isFeatured}
                    onChange={(e) => setNewProduct({...newProduct, isFeatured: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    // Clear input fields
                    setColorInputValue('');
                    setSizeInputValue('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setEditingProduct(null);
            if (editColorInputRef.current) editColorInputRef.current.value = '';
            if (editSizeInputRef.current) editSizeInputRef.current.value = '';
          }}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Product</h3>
            <form onSubmit={handleEditProduct} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                  <input
                    type="text"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category *</label>
                  <select
                    value={editingProduct.category || 'Other'}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {CATEGORY_OPTIONS.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Brand</label>
                  <input
                    type="text"
                    value={editingProduct.brand || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Material *</label>
                  <input
                    type="text"
                    value={editingProduct.meterial || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, meterial: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Pricing and Inventory */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">MRP</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.mrp || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, mrp: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock *</label>
                  <input
                    type="number"
                    value={editingProduct.stock || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Special Feature</label>
                <input
                  type="text"
                  value={editingProduct.specialFeature || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, specialFeature: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Waterproof, Anti-slip, etc."
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Images {(editingProduct.images || []).length > 0 && `(${(editingProduct.images || []).length} uploaded)`}
                </label>
                <div className="mt-2 space-y-2">
                  {(editingProduct.images || []).length > 0 ? (
                    (editingProduct.images || []).map((image, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg">
                        <div className="relative">
                          <img 
                            src={getImageUrl(image.url)} 
                            alt={image.alt} 
                            className="w-16 h-16 object-cover rounded border" 
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTI4IDI4TDQ0IDQ0IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik00NCAyOEwyOCA0NCIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                            }}
                          />
                          {image.isPrimary === true && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-full">
                              ★
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-600">
                            Image {index + 1}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {image.url.split('/').pop() || 'Uploaded image'}
                          </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          type="button"
                          onClick={() => {
                            console.log('=== EDIT MODAL PRIMARY CLICK ===');
                            console.log('Clicked index:', index);
                            console.log('Current images before update:', editingProduct.images);
                            
                            // Functional update for edit modal
                            setEditingProduct(prevProduct => {
                              const updatedImages = prevProduct.images.map((img, i) => ({
                                ...img,
                                isPrimary: i === index
                              }));
                              
                              console.log('Updated images:', updatedImages);
                              console.log('Primary image index:', index);
                              console.log('Primary image:', updatedImages[index]);
                              
                              setForceUpdate(prev => prev + 1); // Force re-render
                              return {
                                ...prevProduct,
                                images: updatedImages
                              };
                            });
                          }}
                          className={`px-2 py-1 text-xs rounded ${
                            image.isPrimary === true
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {image.isPrimary === true ? 'Primary' : 'Set Primary'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleImageRemove(editingProduct, index)}
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No images uploaded yet. Please upload at least one image.
                    </div>
                  )}
                  
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                    <div className="text-center">
                      <FaUpload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="mt-2">
                        <label htmlFor="file-upload-edit" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            {(editingProduct.images || []).length > 0 ? 'Add More Images' : 'Upload Images'}
                          </span>
                          <input
                            id="file-upload-edit"
                            name="file-upload-edit"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            multiple
                            onChange={async (e) => {
                              const files = Array.from(e.target.files);
                              if (files.length > 0) {
                                setIsUploading(true);
                                try {
                                  // Upload files sequentially to avoid race conditions
                                  for (const file of files) {
                                    await handleImageUpload(editingProduct, file);
                                  }
                                } catch (error) {
                                  console.error('Upload error:', error);
                                } finally {
                                  setIsUploading(false);
                                  // Reset input after upload
                                  e.target.value = '';
                                }
                              }
                            }}
                          />
                        </label>
                        <p className="mt-1 text-xs text-gray-500">
                          {isUploading ? 'Uploading images...' : `PNG, JPG, GIF up to 10MB each • ${(editingProduct.images || []).length === 0 ? 'At least 1 image required' : 'Multiple images allowed'}`}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Available Colors</label>
                <div className="mt-2 space-y-2">
                  {(editingProduct.colors || []).map((color, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-gray-100 rounded text-sm">{color}</span>
                      <button
                        type="button"
                        onClick={() => handleColorRemove(editingProduct, index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <input
                      ref={editColorInputRef}
                      type="text"
                      defaultValue=""
                      placeholder="Add color (e.g., Blue, Red, Green)"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const value = e.target.value.trim();
                          if (value) {
                            setEditingProduct(prevProduct => {
                              const currentColors = prevProduct.colors || [];
                              const newColors = [...currentColors, value];
                              return {
                                ...prevProduct,
                                colors: newColors
                              };
                            });
                          e.target.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const inputValue = editColorInputRef.current?.value?.trim();
                        if (inputValue) {
                          setEditingProduct(prevProduct => ({
                            ...prevProduct,
                            colors: [...(prevProduct.colors || []), inputValue]
                          }));
                          editColorInputRef.current.value = '';
                        }
                      }}
                      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Available Sizes</label>
                <div className="mt-2 space-y-2">
                  {(editingProduct.sizes || []).map((size, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-gray-100 rounded text-sm">{size}</span>
                      <button
                        type="button"
                        onClick={() => handleSizeRemove(editingProduct, index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <input
                      ref={editSizeInputRef}
                      type="text"
                      defaultValue=""
                      placeholder="Add size (e.g., Small, Medium, Large)"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const value = e.target.value.trim();
                          if (value) {
                            setEditingProduct(prevProduct => {
                              const currentSizes = prevProduct.sizes || [];
                              const newSizes = [...currentSizes, value];
                              return {
                                ...prevProduct,
                                sizes: newSizes
                              };
                            });
                          e.target.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const inputValue = editSizeInputRef.current?.value?.trim();
                        if (inputValue) {
                          setEditingProduct(prevProduct => ({
                            ...prevProduct,
                            sizes: [...(prevProduct.sizes || []), inputValue]
                          }));
                          editSizeInputRef.current.value = '';
                        }
                      }}
                      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingProduct.isActive || false}
                    onChange={(e) => setEditingProduct({...editingProduct, isActive: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured || false}
                    onChange={(e) => setEditingProduct({...editingProduct, isFeatured: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    // Clear input fields
                    if (editColorInputRef.current) editColorInputRef.current.value = '';
                    if (editSizeInputRef.current) editSizeInputRef.current.value = '';
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <FaTrash className="h-6 w-6 text-red-600" />
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Product
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure remove this product?
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDeleteProduct}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
