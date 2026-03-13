import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderApi, orderSSE } from "../services/api";
import { toast } from "react-toastify";

export default function OrdersPage() {
  const navigate = useNavigate();
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
            console.log('=== SSE MESSAGE RECEIVED ===');
            console.log('Raw event data:', event.data);
            
            const data = JSON.parse(event.data);
            console.log('Parsed data:', data);
            
            // Handle error responses
            if (data.success === false) {
              console.error('SSE error:', data.message);
              toast.error(`Connection error: ${data.message}`);
              setIsConnected(false);
              return;
            }
            
            if (data.type === 'order_update') {
              console.log('Processing order update:', data);
              console.log('Current orders before update:', orders);
              
              // Update specific order status
              setOrders(prevOrders => {
                const updatedOrders = prevOrders.map(order => {
                  if (order._id === data.orderId) {
                    console.log('Updating order:', order._id, 'to status:', data.newStatus);
                    return { 
                      ...order, 
                      status: data.newStatus,
                      trackingNumber: data.orderData.trackingNumber,
                      notes: data.orderData.notes,
                      estimatedDelivery: data.orderData.estimatedDelivery,
                      deliveredAt: data.orderData.deliveredAt
                    };
                  }
                  return order;
                });
                console.log('Updated orders:', updatedOrders);
                return updatedOrders;
              });
              
              // Show notification
              toast.success(`Order ${data.orderId} status updated to ${data.newStatus}`);
            } else if (data.type === 'initial_data') {
              console.log('Received initial data:', data.orders);
              // Update orders with fresh data
              setOrders(data.orders || []);
            } else if (data.type === 'connected') {
              console.log('Connected to real-time updates');
            } else if (data.type === 'ping') {
              // Keep alive ping - no action needed
            }
            
            console.log('=== END SSE MESSAGE PROCESSING ===');
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
        return 'bg-amber-50 text-amber-700';
      case 'Order Received':
        return 'bg-blue-50 text-blue-700';
      case 'Processing':
        return 'bg-amber-50 text-amber-700';
      case 'Packed':
        return 'bg-amber-50 text-amber-700';
      case 'Shipped':
        return 'bg-amber-50 text-amber-700';
      case 'In Transit':
        return 'bg-amber-50 text-amber-700';
      case 'Out for Delivery':
        return 'bg-amber-50 text-amber-700';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700';
      case 'Returned':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
      <div className="bg-white flex items-center justify-center py-10">
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
              className="inline-flex items-center text-gray-900 hover:text-teal-700 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>
          <h1 className="page-title text-gray-900 mb-2 text-center">Your Orders</h1>
          <div className="flex flex-col items-center justify-center py-10">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 mb-2">Please login to view your orders</p>
            <p className="text-gray-500 mb-6">Your orders will appear here</p>
            <Link to="/cotton-yoga-mats" className="text-sm font-semibold text-gray-900 underline">
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
              className="inline-flex items-center text-gray-900 hover:text-teal-700 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-center">Your Orders</h1>
          <div className="flex flex-col items-center justify-center py-10">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="section-title text-gray-900 mb-2">No orders yet</h2>
            <p className="text-base text-gray-600 mb-6">Start shopping to see your orders here</p>
            <Link 
              to="/cotton-yoga-mats" 
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="page-title text-gray-900">Your Orders</h1>
              <p className="text-gray-600 text-sm sm:text-base mt-2">Track your order status and history</p>
            </div>
            {isConnected && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-medium">Live updates</span>
              </div>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order._id || order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
              {/* Order Card Header */}
              <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-teal-50/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Order #{order.orderNumber || order._id?.slice(-8) || 'N/A'}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m5 0a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V13a2 2 0 012-2h10a2 2 0 012 2v10z" />
                        </svg>
                        {new Date(order.createdAt || order.orderDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {order.estimatedDelivery && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Est. {new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:items-end">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold w-fit ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                      ₹{(order.totalAmount || order.total).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 sm:p-8">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Items ({order.items?.length || 0})</h4>
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-20 h-20 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-50">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-gray-900 line-clamp-2 mb-1">{item.title}</h5>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>{item.quantity} × ₹{item.price.toLocaleString('en-IN')}</span>
                          <span className="font-bold text-gray-900">₹{(item.quantity * item.price).toLocaleString('en-IN')}</span>
                        </div>

                        {/* Rate Product Button */}
                        {order.status === 'Delivered' && (
                          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
                            {/* <button
                              onClick={() => navigate(`/ratings/${item.productId || item.id}?from=orders`)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg transition-colors border border-yellow-200 font-medium"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              Rate Product
                            </button> */}
                          </div>
                        )}

                        {/* Not Delivered Yet Message */}
                        {order.status !== 'Delivered' && (
                          <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                            ℹ️ Rating available after delivery
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Footer */}
              <div className="px-6 sm:px-8 py-4 sm:py-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-600 space-y-1">
                  {order.trackingNumber && (
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">Tracking:</span>
                      <code className="bg-white px-3 py-1 rounded border border-gray-200 font-mono text-xs">{order.trackingNumber}</code>
                    </p>
                  )}
                  {order.notes && (
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">Note:</span>
                      <span>{order.notes}</span>
                    </p>
                  )}
                </div>
                <Link
                  to={`/order-details/${order._id || order.id}`}
                  className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 hover:shadow-md transition-all text-center text-sm sm:text-base whitespace-nowrap"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
