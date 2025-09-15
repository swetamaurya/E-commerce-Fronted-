import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';


import OrderFilter from '../components/OrderFilter';

export default function OrderTrackingPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchOrderId, setSearchOrderId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Handler to go back to previous page
  const handleGoBack = () => {
    navigate('/account'); // This navigates back to the account page where order list is shown
  };

  // Function to get user orders from localStorage
  const getUserOrders = () => {
    return new Promise((resolve) => {
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      resolve(savedOrders);
    });
  };
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    setLoading(true);
    getUserOrders()
      .then((savedOrders) => {
        setOrders(savedOrders || []);

        if (savedOrders && savedOrders.length > 0) {
          const id = setInterval(updateOrderStatuses, 10000); // 10s
          // cleanup interval if component unmounts
          return () => clearInterval(id);
        }
      })
      .catch((err) => {
        console.error('Error loading orders:', err);
        toast.error('Failed to load orders');
      })
      .finally(() => setLoading(false));
  }, [navigate]);



  // Simulate status progress
  const updateOrderStatuses = () => {
    setOrders((prev) => {
      const updated = (prev || []).map((order) => {
        if (order.status === 'Delivered') return order;

        const orderDate = new Date(order.date);
        const now = new Date();
        const hours = (now - orderDate) / (1000 * 60 * 60);

        let newStatus = order.status;
        let statusDetails = order.statusDetails || {};

        if (hours < 0.03) {
          newStatus = 'Order Received';
          statusDetails.orderReceived = {
            time: new Date().toISOString(),
            message: 'Your order has been received and is being processed.',
          };
        } else if (hours < 0.06) {
          newStatus = 'Processing';
          statusDetails.processing = {
            time: new Date().toISOString(),
            message: 'Your order is being processed by our team.',
          };
        }  else if (hours < 0.15) {
          newStatus = 'Packed';
          statusDetails.packed = {
            time: new Date().toISOString(),
            message: 'Your order has been packed and is ready for shipping.',
          };
        } else if (hours < 0.18) {
          newStatus = 'Shipped';
          statusDetails.shipped = {
            time: new Date().toISOString(),
            message: 'Your order has been shipped and is on its way.',
          };
        } else if (hours < 0.21) {
          newStatus = 'In Transit';
          statusDetails.inTransit = {
            time: new Date().toISOString(),
            message: 'Your order is in transit to your location.',
          };
        } else if (hours < 0.24) {
          newStatus = 'Out for Delivery';
          statusDetails.outForDelivery = {
            time: new Date().toISOString(),
            message: 'Your order is out for delivery and will arrive soon.',
          };
        } else {
          newStatus = 'Delivered';
          statusDetails.delivered = {
            time: new Date().toISOString(),
            message: 'Your order has been delivered successfully.',
          };
        }

        return { ...order, status: newStatus, statusDetails };
      });

      localStorage.setItem('orders', JSON.stringify(updated));

      // keep selected order in sync if open
      if (selectedOrder) {
        const fresh = updated.find((o) => o.id === selectedOrder.id);
        if (fresh) setSelectedOrder(fresh);
      }

      return updated;
    });
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const id = (searchOrderId || '').trim();
    if (!id) {
      toast.error('Please enter an order ID');
      return;
    }

    setLoading(true);

    getOrderById(id)
      .then((found) => {
        if (!found) {
          toast.error('Order not found');
          throw new Error('Order not found');
        }
        setSelectedOrder(found);

        // add into list for guest if missing
        setOrders((prev) => {
          if (!prev.some((o) => o.id === found.id)) {
            const next = [...prev, found];
            localStorage.setItem('orders', JSON.stringify(next));
            return next;
          }
          return prev;
        });

        return getOrderStatusHistory(found.id);
      })
      .then((hist) => {
        if (hist && hist.length > 0) toast.success('Order found!');
      })
      .catch((err) => {
        console.error('Error fetching order:', err);
      })
      .finally(() => setLoading(false));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Received':
        return 'bg-gray-100 text-gray-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      
      case 'Packed':
        return 'bg-indigo-100 text-indigo-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'In Transit':
        return 'bg-pink-100 text-pink-800';
      case 'Out for Delivery':
        return 'bg-orange-100 text-orange-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const fullStatusList = [
    'Order Received',
    'Processing',
  
    'Packed',
    'Shipped',
    'In Transit',
    'Out for Delivery',
    'Delivered',
  ];

  return (
    <div className="min-h-[70vh]">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-4">
          <button 
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" color="transparent" /> Back
          </button>
        </div>
        

        {/* --- RENDERING LOGIC --- */}
        {selectedOrder ? (
          /* Selected order detail (single-column card) */
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Order #{selectedOrder.id}</h2>
                  <p className="text-gray-500">
                    Placed on{' '}
                    {new Date(selectedOrder.date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="mb-8">
                <h3 className="font-medium mb-2">Delivery Status</h3>
                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200" />
                  <div className="relative flex justify-between">
                    {fullStatusList.map((status, index) => {
                      const statusIndex = fullStatusList.indexOf(selectedOrder.status);
                      const isCompleted = index <= statusIndex;
                      const isCurrent = index === statusIndex;
                      return (
                        <div key={status} className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full z-10 flex items-center justify-center ${
                              isCompleted ? 'bg-teal-600' : 'bg-gray-300'
                            } ${isCurrent ? 'ring-2 ring-teal-300 ring-offset-2' : ''}`}
                          >
                            {isCompleted && (
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="text-xs mt-2 text-center">{status}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Summary blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="font-medium">{selectedOrder.address?.name}</p>
                    <p>{selectedOrder.address?.street}</p>
                    <p>
                      {selectedOrder.address?.city}, {selectedOrder.address?.state}{' '}
                      {selectedOrder.address?.pincode}
                    </p>
                    <p>Phone: {selectedOrder.address?.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span>Payment Method</span>
                      <span className="font-medium">
                        {selectedOrder.paymentMethod === 'COD'
                          ? 'Online Payment'
                          : selectedOrder.paymentMethod === 'Card'
                          ? 'Credit/Debit Card'
                          : 'UPI'}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Items</span>
                      <span className="font-medium">{selectedOrder.items?.length || 0}</span>
                    </div>
                    <div className="flex justify-between mb-2 border-t pt-2">
                      <span>Estimated Delivery</span>
                      <span className="font-medium">
                        {new Date(selectedOrder.estimatedDelivery).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items table */}
              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                {item.image ? (
                                  <img
                                    className="h-10 w-10 rounded-md object-cover"
                                    src={item.image}
                                    alt={item.name}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{item.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : loading ? (
          /* Loader */
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : isLoggedIn ? (
          /* Logged-in view: either list or master/detail */
          <div className="space-y-6">
            {/* Filter Section (Display Only) */}
            <div className="mb-6">
              <OrderFilter />
            </div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
                <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                
                <Link
                  to="/"
                  className="bg-teal-600 text-white py-2 px-6 rounded-md font-medium hover:bg-teal-700 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              // If no selected order yet, show a simple list to pick one.
              !selectedOrder && (
                <div className="grid grid-cols-1 gap-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => handleOrderSelect(order)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedOrder?.id === order.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'hover:border-gray-400'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* If you want a master/detail layout when logged-in & selected: */}
            {selectedOrder && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 border-b">
                      <h2 className="font-semibold">Your Orders</h2>
                    </div>
                    <div className="divide-y max-h-[500px] overflow-y-auto">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className={`p-4 cursor-pointer hover:bg-gray-50 ${
                            selectedOrder?.id === order.id ? 'bg-gray-50' : ''
                          }`}
                          onClick={() => handleOrderSelect(order)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{order.id}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side re-uses the selectedOrder card from above if you want.
                    To keep this file concise, we rely on the single-card block rendered earlier
                    when selectedOrder is set. */}
              </div>
            )}
          </div>
        ) : /* Guest & no selected order */ (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Enter Your Order ID</h2>
            <p className="text-gray-600 mb-6">
              Please enter your order ID in the search box above to track your order.
            </p>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
              <Link
                to="/"
                className="bg-teal-600 text-white py-2 px-6 rounded-md font-medium hover:bg-teal-700 transition-colors"
              >
                Go to Homepage
              </Link>
              <Link
                to="/login"
                className="border border-teal-600 text-teal-600 py-2 px-6 rounded-md font-medium hover:bg-teal-50 transition-colors"
              >
                Login to View All Orders
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
