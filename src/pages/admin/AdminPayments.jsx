import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaEdit, FaChevronLeft, FaChevronRight, FaCreditCard, FaCheck, FaTimes, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Static payments data for testing
const STATIC_PAYMENTS = [
  {
    _id: '1',
    paymentId: 'PAY001',
    orderId: 'ORD001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    amount: 2500,
    status: 'Completed',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN123456789',
    createdAt: '2025-01-14',
    processedAt: '2025-01-14',
    gateway: 'Razorpay',
    notes: 'Payment successful'
  },
  {
    _id: '2',
    paymentId: 'PAY002',
    orderId: 'ORD002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    amount: 1800,
    status: 'Pending',
    paymentMethod: 'UPI',
    transactionId: 'TXN987654321',
    createdAt: '2025-01-13',
    processedAt: '',
    gateway: 'Razorpay',
    notes: 'Payment verification pending'
  },
  {
    _id: '3',
    paymentId: 'PAY003',
    orderId: 'ORD003',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    amount: 3200,
    status: 'Failed',
    paymentMethod: 'Net Banking',
    transactionId: 'TXN456789123',
    createdAt: '2025-01-12',
    processedAt: '',
    gateway: 'Razorpay',
    notes: 'Payment failed - insufficient funds'
  },
  {
    _id: '4',
    paymentId: 'PAY004',
    orderId: 'ORD004',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah@example.com',
    amount: 1500,
    status: 'Completed',
    paymentMethod: 'Debit Card',
    transactionId: 'TXN789123456',
    createdAt: '2025-01-10',
    processedAt: '2025-01-10',
    gateway: 'Razorpay',
    notes: 'Payment successful'
  },
  {
    _id: '5',
    paymentId: 'PAY005',
    orderId: 'ORD005',
    customerName: 'David Brown',
    customerEmail: 'david@example.com',
    amount: 2800,
    status: 'Processing',
    paymentMethod: 'Wallet',
    transactionId: 'TXN321654987',
    createdAt: '2025-01-14',
    processedAt: '',
    gateway: 'Razorpay',
    notes: 'Payment being processed'
  }
];

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [pagination, setPagination] = useState({});
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    notes: ''
  });
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  useEffect(() => {
    console.log('AdminPayments mounted');
    fetchPayments();
  }, [currentPage, searchTerm]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      console.log('Fetching payments...');
      
      // Use static data for now
      let filteredPayments = STATIC_PAYMENTS;
      console.log('Static payments:', filteredPayments);
      
      // Apply search filter
      if (searchTerm) {
        filteredPayments = STATIC_PAYMENTS.filter(payment =>
          payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Simulate pagination
      const limit = 5;
      const startIndex = (currentPage - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPayments = filteredPayments.slice(startIndex, endIndex);
      
      setPayments(paginatedPayments);
      setTotalPayments(filteredPayments.length);
      setTotalPages(Math.ceil(filteredPayments.length / limit));
      setPagination({
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage < Math.ceil(filteredPayments.length / limit)
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payments');
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

  const handleUpdateStatus = (payment) => {
    setSelectedPayment(payment);
    setUpdateData({
      status: payment.status || '',
      notes: payment.notes || ''
    });
    setShowUpdateModal(true);
  };

  const handleSubmitUpdate = async () => {
    if (!selectedPayment) return;

    try {
      // Update the static data
      setPayments(payments.map(payment => 
        payment._id === selectedPayment._id 
          ? { ...payment, ...updateData }
          : payment
      ));
      
      toast.success('Payment status updated successfully');
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Failed to update payment status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      case 'Refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <FaCheck className="w-3 h-3" />;
      case 'Pending': return <FaClock className="w-3 h-3" />;
      case 'Processing': return <FaClock className="w-3 h-3" />;
      case 'Failed': return <FaTimes className="w-3 h-3" />;
      case 'Cancelled': return <FaTimes className="w-3 h-3" />;
      case 'Refunded': return <FaExclamationTriangle className="w-3 h-3" />;
      default: return <FaClock className="w-3 h-3" />;
    }
  };

  console.log('AdminPayments render - loading:', loading, 'payments:', payments);

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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payments Management</h1>
        </div>
        <div className="text-xs sm:text-sm text-gray-500">
          Total Payments: {totalPayments}
        </div>
      </div>

      {/* Search Bar - Responsive */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search payments by ID, order ID, customer, status, or payment method..."
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

      {/* Payments Table - Desktop View */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount & Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <FaCreditCard className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.paymentId}
                        </div>
                        <div className="text-sm text-gray-500">
                          Order: {payment.orderId}
                        </div>
                        <div className="text-xs text-gray-400">
                          {payment.transactionId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        ₹{payment.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.paymentMethod}
                      </div>
                      <div className="text-xs text-gray-400">
                        {payment.gateway}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span className="ml-1">{payment.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleUpdateStatus(payment)}
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
        {payments.map((payment) => (
          <div key={payment._id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-3">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FaCreditCard className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {payment.paymentId}
                    </h3>
                    <p className="text-xs text-gray-600">
                      Order: {payment.orderId} • ₹{payment.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleUpdateStatus(payment)}
                  className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors duration-200"
                  title="Update Payment"
                >
                  <FaEdit className="w-3 h-3" />
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-900">{payment.customerName}</span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                    <span className="ml-1">{payment.status}</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{payment.customerEmail}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{payment.paymentMethod}</span>
                  <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="text-xs text-gray-400">
                  {payment.transactionId}
                </div>
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
            <p className="text-xs text-gray-700">
              Showing <span className="font-medium">{((currentPage - 1) * 5) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * 5, totalPayments)}
              </span>{' '}
              of <span className="font-medium">{totalPayments}</span> results
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
        
        {/* Desktop Pagination */}
        <div className="hidden sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{((currentPage - 1) * 5) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * 5, totalPayments)}
              </span>{' '}
              of <span className="font-medium">{totalPayments}</span> results
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

      {payments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No payments found</p>
        </div>
      )}

      {/* Update Status Modal */}
      {showUpdateModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Update Payment Status - {selectedPayment.paymentId}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={updateData.status}
                    onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Failed">Failed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={updateData.notes}
                    onChange={(e) => setUpdateData({...updateData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Add any notes for the payment"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
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
