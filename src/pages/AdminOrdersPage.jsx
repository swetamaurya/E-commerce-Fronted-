import { useState, useEffect } from "react";
import { adminOrderApi } from "../services/api";
import { toast } from "react-toastify";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    trackingNumber: '',
    notes: '',
    estimatedDelivery: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminOrderApi.getAllOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.status || '',
      trackingNumber: order.trackingNumber || '',
      notes: order.notes || '',
      estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().split('T')[0] : ''
    });
    setShowUpdateModal(true);
  };

  const handleSubmitUpdate = async () => {
    if (!selectedOrder) return;

    try {
      await adminOrderApi.updateOrderStatus(selectedOrder._id, updateData);
      toast.success('Order status updated successfully');
      setShowUpdateModal(false);
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error updating order:', error);
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
      case 'Returned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">Manage and update order statuses</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.orderId}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Customer: {order.customerName} ({order.customerEmail})
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Phone: {order.customerPhone}
                    </p>
                    <p className="text-sm text-gray-600">
                      Placed: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    {order.trackingNumber && (
                      <p className="text-sm text-gray-600 mt-1">
                        Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleUpdateStatus(order)}
                      className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors"
                    >
                      Update Status
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">{item.productName}</span>
                        <span className="text-gray-600">
                          Qty: {item.quantity} × ₹{item.price} = ₹{item.quantity * item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Total Amount:</span>
                      <span>₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>

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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={updateData.status}
                    onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={updateData.trackingNumber}
                    onChange={(e) => setUpdateData({...updateData, trackingNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter tracking number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Delivery
                  </label>
                  <input
                    type="date"
                    value={updateData.estimatedDelivery}
                    onChange={(e) => setUpdateData({...updateData, estimatedDelivery: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={updateData.notes}
                    onChange={(e) => setUpdateData({...updateData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows="3"
                    placeholder="Add any notes for the customer"
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
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
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
