import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaEdit, FaChevronLeft, FaChevronRight, FaShoppingCart, FaUser, FaPhone, FaCalendar, FaTruck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { adminOrderApi } from '../services/api';

// Order status options
const ORDER_STATUSES = [
  'Order Received',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled'
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pagination, setPagination] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    notes: '',
    estimatedDelivery: ''
  });
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders from API
      const response = await adminOrderApi.getAllOrders();
      
      if (response && response.data) {
        let allOrders = response.data;
        
        // Apply search filter
        if (searchTerm) {
          allOrders = allOrders.filter(order =>
            order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.status?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Calculate pagination
        const limit = 5;
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedOrders = allOrders.slice(startIndex, endIndex);
        
        setOrders(paginatedOrders);
        setTotalOrders(allOrders.length);
        setTotalPages(Math.ceil(allOrders.length / limit));
        setPagination({
          hasPrevPage: currentPage > 1,
          hasNextPage: currentPage < Math.ceil(allOrders.length / limit)
        });
      } else {
        toast.error('Failed to load orders');
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    if (value.trim()) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      setSearchTerm(value);
      setCurrentPage(1);
      setIsSearching(false);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    
    // Format estimated delivery date properly
    let formattedEstimatedDelivery = '';
    if (order.estimatedDelivery) {
      try {
        const date = new Date(order.estimatedDelivery);
        if (!isNaN(date.getTime())) {
          formattedEstimatedDelivery = date.toISOString().split('T')[0];
        }
      } catch (error) {
        formattedEstimatedDelivery = '';
      }
    }
    
    setUpdateData({
      status: order.status || '',
      notes: order.notes || '',
      estimatedDelivery: formattedEstimatedDelivery
    });
    setShowUpdateModal(true);
  };

  const handleSubmitUpdate = async () => {
    if (!selectedOrder) return;

    try {
      // Call API to update order status
      const response = await adminOrderApi.updateOrderStatus(selectedOrder._id, updateData);
      
      if (response && response.success) {
        toast.success('Order status updated successfully');
        setShowUpdateModal(false);
        
        // Refresh orders to get latest data from server
        await fetchOrders();
      } else {
        throw new Error(response?.message || 'Failed to update order status');
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Order Received': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-purple-100 text-purple-800';
      case 'Packed': return 'bg-indigo-100 text-indigo-800';
      case 'Shipped': return 'bg-cyan-100 text-cyan-800';
      case 'In Transit': return 'bg-orange-100 text-orange-800';
      case 'Out for Delivery': return 'bg-pink-100 text-pink-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Returned': return 'bg-gray-100 text-gray-900';
      default: return 'bg-gray-100 text-gray-900';
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders Management</h1>
        </div>
        <div className="text-xs sm:text-sm text-gray-500">
          Total Orders: {totalOrders}
        </div>
        </div>

      {/* Search Bar - Responsive */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search orders by ID, customer name, email, or status..."
            value={localSearchTerm}
            onChange={handleSearch}
            className="w-full pl-8 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="off"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        {localSearchTerm && (
          <div className="mt-2 text-xs sm:text-sm text-gray-500">
            Searching for: "{localSearchTerm}"
                    </div>
                    )}
                  </div>
                  
      {/* Orders Table - Desktop View */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Est. Delivery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FaShoppingCart className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderId}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items?.length || 0} items
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'Not set'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleUpdateStatus(order)}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                      <FaEdit className="w-4 h-4 mr-1" />
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
                  </div>
                </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-3">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaShoppingCart className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {order.orderId}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {order.items?.length || 0} items • ₹{order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleUpdateStatus(order)}
                  className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors duration-200"
                  title="Update Order"
                >
                  <FaEdit className="w-3 h-3" />
                </button>
              </div>
              
                  <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaUser className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-900">{order.customerName}</span>
                  </div>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                        </span>
                      </div>
                
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <FaPhone className="w-3 h-3" />
                  <span>{order.customerPhone}</span>
                  </div>
                
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <FaCalendar className="w-3 h-3" />
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                
                {order.estimatedDelivery && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <FaTruck className="w-3 h-3" />
                    <span>Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                  </div>
                )}
                
                {order.trackingNumber && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <FaTruck className="w-3 h-3" />
                    <span>Tracking: {order.trackingNumber}</span>
                  </div>
                )}
                </div>
              </div>
            </div>
          ))}
        </div>

      {/* Pagination - Responsive */}
      <div className="bg-white px-3 sm:px-4 py-3 border-t border-gray-200">
        {/* Mobile Pagination */}
        <div className="flex flex-col space-y-3 sm:hidden">
          {/* Mobile Info */}
          <div className="text-center">
            <p className="text-xs text-gray-600">
              Showing <span className="font-medium">{((currentPage - 1) * 5) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * 5, totalOrders)}
              </span>{' '}
              of <span className="font-medium">{totalOrders}</span> results
            </p>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="flex items-center px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
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
              className="flex items-center px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
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
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Desktop Pagination */}
        <div className="hidden sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{((currentPage - 1) * 5) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * 5, totalOrders)}
              </span>{' '}
              of <span className="font-medium">{totalOrders}</span> results
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

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}

      {/* Update Status Modal */}
      {showUpdateModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Update Order Status - #{selectedOrder.orderId}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Status
                  </label>
                  <select
                    value={updateData.status}
                    onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Order Received">Order Received</option>
                    <option value="Processing">Processing</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Returned">Returned</option>
                  </select>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Estimated Delivery
                  </label>
                  <input
                    type="date"
                    value={updateData.estimatedDelivery}
                    onChange={(e) => setUpdateData({...updateData, estimatedDelivery: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={updateData.notes}
                    onChange={(e) => setUpdateData({...updateData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Add any notes for the customer"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
