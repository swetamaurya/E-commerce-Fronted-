import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderApi, cartApi } from '../services/api';
import { createRazorpayOrder, openRazorpayPayment, verifyPayment } from '../utils/razorpay';

export default function PaymentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [cartData, setCartData] = useState(null);
  const [cartFetched, setCartFetched] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (!localStorage.getItem('token')) {
      toast.error('Please login to continue');
      navigate('/cart');
      return;
    }

    if (!localStorage.getItem('shippingAddress')) {
      toast.error('Please provide shipping address first');
      navigate('/address');
    }

    if (!cartFetched && !loading) {
      const fetchCartData = async () => {
        try {
          setLoading(true);
          const response = await cartApi.getCart();
          if (response && response.data) {
            setCartData(response.data);
            setCartFetched(true);
          } else {
            toast.error('Invalid cart data received');
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
          toast.error('Failed to load cart data');
        } finally {
          setLoading(false);
        }
      };
      fetchCartData();
    }
  }, [navigate, cartFetched]);

  const generateOrderId = () => {
    return 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (processingOrder) return;

    setLoading(true);
    setProcessingOrder(true);

    try {
      const freshCartResponse = await cartApi.getCart();
      const freshCartData = freshCartResponse.data;

      if (!freshCartData || !freshCartData.items || freshCartData.items.length === 0) {
        toast.error('Your cart is empty. Please add items to cart first.');
        navigate('/cart');
        setLoading(false);
        return;
      }

      setCartData(freshCartData);
      const newOrderId = generateOrderId();
      setOrderId(newOrderId);

      if (paymentMethod === 'cod') {
        try {
          const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
          const user = JSON.parse(localStorage.getItem('user') || '{}');

          const orderData = {
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: user.mobile || '',
            shippingAddress: shippingAddress,
            paymentMethod: 'COD',
            paymentStatus: 'Pending',
            orderId: newOrderId,
            discountAmount: 0,
            shippingAmount: 0,
            taxAmount: 0,
            notes: 'Order placed with Cash on Delivery'
          };

          await orderApi.createOrder(orderData);
          localStorage.removeItem('shippingAddress');
          window.dispatchEvent(new CustomEvent('cartUpdated'));
          setOrderPlaced(true);
          toast.success('Order placed with Cash on Delivery');
        } catch (error) {
          console.error('Error placing COD order:', error);
          toast.error('Failed to place COD order');
        }
      }

      if (paymentMethod === 'razorpay') {
        try {
          const orderData = await createRazorpayOrder(freshCartData.total);
          const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
          const user = JSON.parse(localStorage.getItem('user') || '{}');

          await openRazorpayPayment(
            {
              ...orderData,
              customer_name: user.name,
              customer_email: user.email,
              customer_phone: user.mobile || '',
              order_id: newOrderId
            },
            async (paymentResponse) => {
              try {
                const verificationResult = await verifyPayment(paymentResponse);
                if (verificationResult.success) {
                  const orderPayload = {
                    customerName: user.name,
                    customerEmail: user.email,
                    customerPhone: user.mobile || '',
                    shippingAddress: shippingAddress,
                    paymentMethod: 'Razorpay',
                    paymentStatus: 'Paid',
                    paymentId: paymentResponse.razorpay_payment_id,
                    orderId: paymentResponse.razorpay_order_id,
                    discountAmount: 0,
                    shippingAmount: 0,
                    taxAmount: 0,
                    notes: 'Order placed via Razorpay'
                  };

                  await orderApi.createOrder(orderPayload);
                  localStorage.removeItem('shippingAddress');
                  window.dispatchEvent(new CustomEvent('cartUpdated'));
                  setOrderPlaced(true);
                  toast.success('Payment successful! Order placed.');
                } else {
                  toast.error('Payment verification failed');
                }
              } catch (error) {
                console.error('Error processing payment:', error);
                toast.error('Payment processing failed');
              }
            },
            (error) => {
              console.error('Payment error:', error);
              toast.error(error || 'Payment failed');
            }
          );
        } catch (error) {
          console.error('Error creating Razorpay order:', error);
          toast.error('Failed to initialize payment');
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
      setProcessingOrder(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-[70vh]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-8 sm:pb-10">
        <h1 className="page-title text-gray-900 text-center mb-4 sm:mb-6">PAYMENT METHOD</h1>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center min-h-[40vh] flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cart data...</p>
          </div>
        ) : !cartData ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="section-title text-gray-900 mb-2">No Cart Data</h2>
            <p className="text-gray-600 mb-4">Unable to load your cart items. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : orderPlaced ? (
          /* Order Success */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="section-title text-gray-900 mb-2">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-6">Your order ID is: <span className="font-semibold">{orderId}</span></p>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Estimated Delivery</h3>
                <p className="text-gray-600">{new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>

              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
                <Link to="/" className="bg-gray-900 text-white py-2.5 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Continue Shopping
                </Link>
                <Link to="/orders" className="border border-gray-300 text-gray-900 py-2.5 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  View Orders
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <div className="space-y-4 sm:space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="section-title text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                {cartData.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} x ₹{item.price}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-base font-bold text-gray-900">₹{cartData.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="section-title text-gray-900 mb-4">Select Payment Method</h2>

                <div className="space-y-3">
                  {/* COD Option */}
                  <label
                    htmlFor="cod"
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      id="cod"
                      name="paymentMethod"
                      type="radio"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
                    />
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm sm:text-base font-semibold text-gray-900 block">Cash on Delivery</span>
                      <span className="text-xs sm:text-sm text-gray-500">Pay when your order is delivered</span>
                    </div>
                    {paymentMethod === 'cod' && (
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>

                  {/* Razorpay Option */}
                  <label
                    htmlFor="razorpay"
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'razorpay'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      id="razorpay"
                      name="paymentMethod"
                      type="radio"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 mt-1"
                    />
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm sm:text-base font-semibold text-gray-900 block">Pay Online</span>
                      <span className="text-xs sm:text-sm text-gray-500 block">Secure payment via Razorpay</span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-[10px] sm:text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">UPI</span>
                        <span className="text-[10px] sm:text-xs font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">Credit/Debit Card</span>
                        <span className="text-[10px] sm:text-xs font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">Net Banking</span>
                        <span className="text-[10px] sm:text-xs font-medium bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">Wallets</span>
                      </div>
                    </div>
                    {paymentMethod === 'razorpay' && (
                      <div className="flex-shrink-0 mt-1">
                        <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>
                </div>

                {/* Info note for selected method */}
                {paymentMethod === 'razorpay' && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs sm:text-sm text-blue-800">
                        You'll be redirected to Razorpay's secure payment gateway where you can pay using UPI, cards, net banking, or wallets.
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs sm:text-sm text-green-800">
                        Pay with cash when your order arrives at your doorstep. No advance payment required.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                <Link
                  to="/address"
                  className="text-gray-600 hover:text-gray-900 py-2.5 px-4 rounded-lg font-medium transition-colors text-center sm:text-left text-sm sm:text-base"
                >
                  ← Back to Address
                </Link>
                <button
                  type="submit"
                  className="bg-gray-900 text-white py-3 px-6 sm:px-8 rounded-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-base"
                  disabled={loading || processingOrder}
                >
                  {loading || processingOrder ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : paymentMethod === 'cod' ? (
                    'Place Order (COD)'
                  ) : (
                    `Pay ₹${cartData.total?.toFixed(2) || '0.00'} with Razorpay`
                  )}
                </button>
              </div>
            </form>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 pt-2 pb-2">
              <div className="flex items-center gap-1.5 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs">Secure Payment</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs">256-bit Encryption</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
