import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { orderApi } from "../services/api";
import { toast } from "react-toastify";
import { generateInvoice } from "../utils/invoiceGenerator";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  console.log('OrderDetailsPage - orderId from params:', orderId);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getOrderDetails(orderId);
        console.log('Order details response:', response);
        
        if (response.success && response.data) {
        setOrder(response.data);
        } else {
          console.error('Order not found or invalid response:', response);
          setOrder(null);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to load order details');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Order Received':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-purple-100 text-purple-800';
      case 'Packed':
        return 'bg-indigo-100 text-indigo-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Out for Delivery':
        return 'bg-orange-100 text-orange-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Returned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending':
        return 'Pending';
      case 'Order Received':
        return 'Order Received';
      case 'Processing':
        return 'Processing';
      case 'Packed':
        return 'Packed';
      case 'Shipped':
        return 'Shipped';
      case 'In Transit':
        return 'In Transit';
      case 'Out for Delivery':
        return 'Out for Delivery';
      case 'Delivered':
        return 'Delivered';
      case 'Cancelled':
        return 'Cancelled';
      case 'Returned':
        return 'Returned';
      default:
        return status || 'Unknown';
    }
  };

  const getOrderSteps = () => {
    const steps = [
      { id: 'Order Received', label: 'Order Received', completed: false },
      { id: 'Processing', label: 'Processing', completed: false },
      { id: 'Packed', label: 'Packed', completed: false },
      { id: 'Shipped', label: 'Shipped', completed: false },
      { id: 'In Transit', label: 'In Transit', completed: false },
      { id: 'Out for Delivery', label: 'Out for Delivery', completed: false },
      { id: 'Delivered', label: 'Delivered', completed: false }
    ];

    if (!order) return steps;

    const currentStatus = order.status;
    const statusIndex = steps.findIndex(step => step.id === currentStatus);
    
    // Mark steps as completed based on current status
    steps.forEach((step, index) => {
      if (index <= statusIndex) {
        step.completed = true;
      }
    });

    return steps;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleDownloadInvoice = async () => {
    if (!order) {
      toast.error('Order data not available');
      return;
    }
    
    try {
      await generateInvoice(order);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
            <Link 
              to="/orders" 
              className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const steps = getOrderSteps();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/orders" 
            className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order.orderId || order._id?.slice(-8) || 'N/A'}
          </h1>
              <p className="text-gray-600">
                Placed on {formatDate(order.createdAt || order.orderDate)}
          </p>
        </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button 
                onClick={handleDownloadInvoice}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Invoice
              </button>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Progress */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Progress</h2>
              
              {/* Current Status */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              {/* Progress Steps - Vertical Layout */}
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    {/* Step Circle */}
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        step.completed ? 'bg-teal-500' : 'bg-gray-300'
                      }`}>
                        {step.completed ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-sm">{index + 1}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Step Content */}
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium ${
                            step.completed ? 'text-teal-600' : 'text-gray-600'
                          }`}>
                            {step.id}
                          </p>
                          {step.completed && (
                            <p className="text-xs text-teal-600">Completed</p>
                          )}
                        </div>
                        {step.completed && (
                          <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h2>
                <div className="text-gray-600">
                  <p className="font-medium text-gray-900">{order.shippingAddress.name || order.customerName}</p>
                  <p>{order.shippingAddress.street || order.shippingAddress.addressLine1}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                  <p>Phone: {order.shippingAddress.phone || order.customerPhone}</p>
                </div>
              </div>
            )}

          {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">PRODUCT</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">PRICE</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">QUANTITY</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                        {item.image ? (
                                  <img src={item.image} alt={item.productName || item.title} className="w-full h-full object-cover" />
                        ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                              <div>
                                <p className="font-medium text-gray-900">{item.productName || item.title}</p>
                                <p className="text-sm text-gray-500">SKU: {item.productId || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-900">₹{item.price}</td>
                          <td className="py-4 px-4 text-gray-900">{item.quantity}</td>
                          <td className="py-4 px-4 font-medium text-gray-900">₹{item.quantity * item.price}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-gray-500">
                          No items found for this order
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                      </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.productName || item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                      </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm line-clamp-2">{item.productName || item.title}</p>
                          <p className="text-xs text-gray-500 mt-1">SKU: {item.productId || 'N/A'}</p>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-gray-600">
                              <span>Qty: {item.quantity}</span>
                              <span className="ml-2">× ₹{item.price}</span>
                    </div>
                            <div className="font-medium text-gray-900 text-sm">
                              ₹{item.quantity * item.price}
                </div>
              </div>
            </div>
          </div>
                  </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No items found for this order
                    </div>
                  )}
                </div>
              </div>
            </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h2>
              
                <div className="space-y-3">
                  <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium text-gray-900">{order.paymentMethod || 'Online Payment'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Items</span>
                  <span className="font-medium text-gray-900">{order.items?.length || 0}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{order.totalAmount || order.subtotal || 0}</span>
                  </div>
                
                  <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">Free</span>
                  </div>
                
                  <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">₹{order.taxAmount || 0}</span>
                  </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">₹{order.totalAmount || order.total || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Information</h2>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Estimated Delivery</span>
                  <p className="font-medium text-gray-900">
                    {order.estimatedDelivery 
                      ? formatDate(order.estimatedDelivery)
                      : 'Not available'
                    }
                  </p>
                  </div>
                
                {order.trackingNumber && (
                  <div>
                    <span className="text-sm text-gray-600">Tracking Number</span>
                    <p className="font-medium text-gray-900">{order.trackingNumber}</p>
                </div>
                )}
                
                {order.notes && (
                  <div>
                    <span className="text-sm text-gray-600">Notes</span>
                    <p className="text-sm text-gray-900">{order.notes}</p>
              </div>
            )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
