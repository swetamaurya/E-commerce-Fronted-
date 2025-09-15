import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderApi, cartApi } from '../services/api';
import { createRazorpayOrder, openRazorpayPayment, verifyPayment } from '../utils/razorpay';

// UPI Payment UI Component
const UpiPaymentUI = ({ upiId, onClose, onSuccess }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">UPI Payment</h2>
        <p className="mb-4 text-center">Please complete your payment using UPI ID: <strong>{upiId}</strong></p>
        
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <p className="text-center text-gray-700">Scan QR code or use your UPI app</p>
          <div className="h-48 w-48 bg-gray-300 mx-auto my-4 flex items-center justify-center">
            {/* QR Code Image */}
            <img 
              src="https://chart.googleapis.com/chart?cht=qr&chl=upi://pay?pa=royalthread@ybl&pn=RoyalThread&am=0&cu=INR&tn=Payment%20for%20Order" 
              alt="UPI QR Code" 
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            onClick={onSuccess}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
          >
            Payment Complete
          </button>
        </div>
      </div>
    </div>
  );
};

// Card Payment UI Component
const CardPaymentUI = ({ cardDetails, onClose, onSuccess }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Card Payment</h2>
        
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <p className="mb-2">Card Number: **** **** **** {cardDetails.cardNumber.slice(-4)}</p>
          <p>Expiry: {cardDetails.expiry}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 text-sm">Please verify your payment details and click "Pay Now" to complete your transaction.</p>
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            onClick={onSuccess}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default function PaymentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [showUpiPaymentUI, setShowUpiPaymentUI] = useState(false);
  const [showCardPaymentUI, setShowCardPaymentUI] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [cartFetched, setCartFetched] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    if (!localStorage.getItem('token')) {
      toast.error('Please login to continue');
      navigate('/cart');
      return;
    }
    
    // Check if shipping address exists
    if (!localStorage.getItem('shippingAddress')) {
      toast.error('Please provide shipping address first');
      navigate('/address');
    }

    // Fetch cart data only once for initial display
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

  // Generate a random order ID
  const generateOrderId = () => {
    return 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (processingOrder) return; // Prevent multiple submissions
    
    setLoading(true);
    setProcessingOrder(true);
    
    try {
      // Fetch fresh cart data to ensure we have the latest quantities
      console.log('Fetching fresh cart data for validation...');
      const freshCartResponse = await cartApi.getCart();
      const freshCartData = freshCartResponse.data;
      
      if (!freshCartData || !freshCartData.items || freshCartData.items.length === 0) {
        toast.error('Your cart is empty. Please add items to cart first.');
        navigate('/cart');
        setLoading(false);
        return;
      }
      
      // Update the local cart data with fresh data
      setCartData(freshCartData);
      
      // No validation needed for Razorpay as it handles all payment methods
      
      // Generate order ID
      const newOrderId = generateOrderId();
      setOrderId(newOrderId);
      
      // Process payment through Razorpay
      if (paymentMethod === 'razorpay') {
        try {
          console.log('Starting Razorpay payment process...');
          console.log('Cart total:', freshCartData.total);
          
          // Create Razorpay order
          const orderData = await createRazorpayOrder(freshCartData.total);
          console.log('Razorpay order created:', orderData);
          
          // Get user and shipping details
          const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          
          console.log('User details:', user);
          console.log('Shipping address:', shippingAddress);
          
          // Open Razorpay payment modal
          await openRazorpayPayment(
            {
              ...orderData,
              customer_name: user.name,
              customer_email: user.email,
              customer_phone: user.mobile || '',
              order_id: newOrderId
            },
            async (paymentResponse) => {
              // Payment successful
              console.log('Payment successful callback triggered:', paymentResponse);
              try {
                // Verify payment
                const verificationResult = await verifyPayment(paymentResponse);
                console.log('Payment verification result:', verificationResult);
                
                if (verificationResult.success) {
                  // Create order
                  const orderData = {
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
                  
                  console.log('Creating order with data:', orderData);
                  await orderApi.createOrder(orderData);
                  
                  // Clear shipping address
                  localStorage.removeItem('shippingAddress');
                  
                  // Set order placed state
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
              // Payment failed or cancelled
              console.error('Payment error callback triggered:', error);
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

  // Handle payment completion
  const handlePaymentSuccess = async () => {
    if (processingOrder) return; // Prevent multiple submissions
    
    // Close payment UIs
    setShowUpiPaymentUI(false);
    setShowCardPaymentUI(false);
    
    setProcessingOrder(true);
    
    // Process the order
    try {
      // Fetch fresh cart data before creating order
      console.log('Fetching fresh cart data before payment order creation...');
      const freshCartResponse = await cartApi.getCart();
      const freshCartData = freshCartResponse.data;
      
      if (!freshCartData || !freshCartData.items || freshCartData.items.length === 0) {
        toast.error('Your cart is empty. Please add items to cart first.');
        navigate('/cart');
        return;
      }

      console.log('Fresh cart data before payment order creation:', {
        itemsCount: freshCartData.items.length,
        total: freshCartData.total,
        items: freshCartData.items.map(item => ({
          productName: item.title,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price
        }))
      });

      const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // Create order data
      const orderData = {
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.mobile || '',
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        paymentStatus: 'Paid',
        discountAmount: 0,
        shippingAmount: 0,
        taxAmount: 0,
        notes: `Order placed via ${paymentMethod.toUpperCase()}`
      };

      // Create order via API (this will automatically clear the cart)
      const response = await orderApi.createOrder(orderData);
      
      // Clear shipping address
      localStorage.removeItem('shippingAddress');
      
      // Set order placed state to show confirmation
      setOrderPlaced(true);
      
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
    } finally {
      setProcessingOrder(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-gray-50">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6">PAYMENT METHOD</h1>
        
        {/* UPI Payment UI Modal */}
        {showUpiPaymentUI && (
          <UpiPaymentUI 
            upiId={upiId}
            onClose={() => setShowUpiPaymentUI(false)}
            onSuccess={handlePaymentSuccess}
          />
        )}
        
        {/* Card Payment UI Modal */}
        {showCardPaymentUI && (
          <CardPaymentUI 
            cardDetails={{ cardNumber, expiry }}
            onClose={() => setShowCardPaymentUI(false)}
            onSuccess={handlePaymentSuccess}
          />
        )}
        
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cart data...</p>
          </div>
        ) : !cartData ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Cart Data</h2>
            <p className="text-gray-600 mb-4">Unable to load your cart items. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-teal-600 text-white py-2 px-4 rounded-md font-medium hover:bg-teal-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : orderPlaced ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-6">Your order ID is: <span className="font-semibold">{orderId}</span></p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Estimated Delivery</h3>
                <p className="text-gray-600">{new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
                <Link to="/" className="bg-teal-600 text-white py-2 px-6 rounded-md font-medium hover:bg-teal-700 transition-colors">
                  Continue Shopping
                </Link>
                <Link to="/orders" className="border border-teal-600 text-teal-600 py-2 px-6 rounded-md font-medium hover:bg-teal-50 transition-colors">
                  View Orders
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 sm:p-6">
              {/* Cart Summary */}
              {cartData && (
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
                  <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    {cartData.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">₹{cartData.total?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">Select Payment Method</h2>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center">
                      <input
                        id="razorpay"
                        name="paymentMethod"
                        type="radio"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <label htmlFor="razorpay" className="ml-3 block text-sm font-medium text-gray-700">
                        <div className="flex items-center">
                          <span>Pay with Razorpay</span>
                          <div className="ml-2 flex items-center space-x-1">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">UPI</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Cards</span>
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Net Banking</span>
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Wallets</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Secure payment with multiple options</p>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Razorpay Payment Information */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Secure Payment with Razorpay</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>Your payment will be processed securely through Razorpay. You can pay using:</p>
                          <ul className="mt-2 list-disc list-inside space-y-1">
                            <li>Credit/Debit Cards (Visa, Mastercard, RuPay)</li>
                            <li>UPI (Google Pay, PhonePe, Paytm, BHIM)</li>
                            <li>Net Banking (All major banks)</li>
                            <li>Digital Wallets (Paytm, Mobikwik, Freecharge)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {false && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-medium mb-4">Card Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          value={cardNumber}
                          onChange={(e) => {
                            // Format card number with spaces after every 4 digits
                            const value = e.target.value.replace(/\s/g, '');
                            if (value.length <= 16 && /^\d*$/.test(value)) {
                              const formatted = value.replace(/(.{4})/g, '$1 ').trim();
                              setCardNumber(formatted);
                            }
                          }}
                          required={paymentMethod === 'card'}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          id="expiry"
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          value={expiry}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 4) {
                              if (value.length <= 2) {
                                setExpiry(value);
                              } else {
                                setExpiry(value.slice(0, 2) + '/' + value.slice(2));
                              }
                            }
                          }}
                          required={paymentMethod === 'card'}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="password"
                          id="cvv"
                          placeholder="123"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          value={cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 3) {
                              setCvv(value);
                            }
                          }}
                          required={paymentMethod === 'card'}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {false && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-medium mb-4">UPI Details</h3>
                    
                    <div>
                      <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                      <input
                        type="text"
                        id="upiId"
                        placeholder="yourname@upi"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        required={paymentMethod === 'upi'}
                      />
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button 
                          type="button" 
                          onClick={() => setUpiId('username@okicici')}
                          className="px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
                        >
                          ICICI UPI
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setUpiId('username@okhdfc')}
                          className="px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
                        >
                          HDFC UPI
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setUpiId('username@oksbi')}
                          className="px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
                        >
                          SBI UPI
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setUpiId('username@paytm')}
                          className="px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
                        >
                          Paytm UPI
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between gap-3">
                <Link to="/address" className="text-teal-600 py-2.5 px-4 sm:px-6 rounded-md font-medium hover:text-teal-700 transition-colors text-center sm:text-left">
                  Back to Address
                </Link>
                <button
                  type="submit"
                  className="bg-teal-600 text-white py-2.5 px-4 sm:px-6 rounded-md font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  disabled={loading || processingOrder}
                >
                  {loading || processingOrder ? 'Processing Payment...' : 'Pay with Razorpay'}
                </button>
              </div>
            </form>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}