import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { orderApi, orderSSE } from "../services/api";
import { toast } from "react-toastify";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef(null);

  // Fetch orders data
  useEffect(() => {
    if (dataFetched) return;
    
    const fetchOrders = async () => {
      if (!localStorage.getItem('token')) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await orderApi.getOrders();
        setOrders(response.data || []);
        setDataFetched(true);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [dataFetched]);

  // Real-time order updates via SSE
  useEffect(() => {
    if (!localStorage.getItem('token') || !dataFetched || eventSourceRef.current) return;

    const connectSSE = () => {
      try {
        // Close existing connection if any
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        console.log('Creating SSE connection...');
        const eventSource = orderSSE.connect();
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          console.log('SSE connection opened');
          setIsConnected(true);
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Handle error responses
            if (data.success === false) {
              console.error('SSE error:', data.message);
              toast.error(`Connection error: ${data.message}`);
              setIsConnected(false);
              return;
            }
            
            if (data.type === 'order_update') {
              // Update specific order status
              setOrders(prevOrders => 
                prevOrders.map(order => 
                  order._id === data.orderId 
                    ? { 
                        ...order, 
                        status: data.newStatus,
                        trackingNumber: data.orderData.trackingNumber,
                        notes: data.orderData.notes,
                        estimatedDelivery: data.orderData.estimatedDelivery,
                        deliveredAt: data.orderData.deliveredAt
                      }
                    : order
                )
              );
              
              // Show notification
              toast.success(`Order ${data.orderId} status updated to ${data.newStatus}`);
            } else if (data.type === 'initial_data') {
              // Update orders with fresh data
              setOrders(data.orders || []);
            } else if (data.type === 'connected') {
              console.log('Connected to real-time updates');
            } else if (data.type === 'ping') {
              // Keep alive ping - no action needed
            }
          } catch (error) {
            console.error('Error parsing SSE data:', error);
          }
        };

        eventSource.onerror = (error) => {
          console.error('SSE connection error:', error);
          console.log('SSE readyState:', eventSource.readyState);
          setIsConnected(false);
          
          // Close current connection
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
          
          // Attempt to reconnect after 5 seconds only if component is still mounted
          setTimeout(() => {
            if (eventSourceRef.current === null) {
              console.log('Attempting to reconnect SSE...');
              connectSSE();
            }
          }, 5000);
        };

      } catch (error) {
        console.error('Error creating SSE connection:', error);
        setIsConnected(false);
      }
    };

    connectSSE();

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsConnected(false);
    };
  }, [dataFetched]);

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

  if (loading) {
    return (
      <div className="bg-white flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!localStorage.getItem('token')) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-center">Your Orders</h1>
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 mb-2">Please login to view your orders</p>
            <p className="text-gray-500 mb-6">Your orders will appear here</p>
            <Link to="/cotton-yoga-mats" className="text-sm font-semibold text-teal-600 underline">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-center">Your Orders</h1>
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-base text-gray-600 mb-6">Start shopping to see your orders here</p>
            <Link 
              to="/cotton-yoga-mats" 
              className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-sm hover:shadow-md"
            >
              Start Shopping
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to="/" 
              className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            {isConnected && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Live updates enabled</span>
              </div>
            )}
          </div>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
            <p className="text-sm sm:text-base text-gray-600">Track your order status and history</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id || order.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 sm:p-6">
                {/* Order Header */}
                <div className="mb-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                        Order #{order.orderNumber || order._id?.slice(-8) || 'N/A'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt || order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-gray-900">
                        ₹{order.totalAmount || order.total}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × ₹{item.price}
                        </p>
                        <p className="text-base font-bold text-gray-900">
                          ₹{item.quantity * item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary and Actions */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="text-sm text-gray-600">
                    <p>Total Items: {order.items?.length || 0}</p>
                    {order.trackingNumber && (
                      <p className="truncate">Tracking: {order.trackingNumber}</p>
                    )}
                  </div>
                  <Link
                    to={`/order-details/${order._id || order.id}`}
                    className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
