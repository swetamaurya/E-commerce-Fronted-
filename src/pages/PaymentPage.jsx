import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderApi, cartApi } from '../services/api';

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
  const [paymentMethod, setPaymentMethod] = useState('COD');
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
          setCartData(response.data);
          setCartFetched(true);
          console.log('Initial cart data loaded:', {
            itemsCount: response.data.items.length,
            total: response.data.total
          });
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
      
      // Validate payment method specific fields
      if (paymentMethod === 'card') {
        if (!cardNumber || !expiry || !cvv) {
          toast.error('Please fill all card details');
          setLoading(false);
          return;
        }
        
        if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
          toast.error('Please enter a valid 16-digit card number');
          setLoading(false);
          return;
        }
      } else if (paymentMethod === 'upi') {
        if (!upiId) {
          toast.error('Please enter your UPI ID');
          setLoading(false);
          return;
        }
        
        if (!upiId.includes('@')) {
          toast.error('Please enter a valid UPI ID');
          setLoading(false);
          return;
        }
      }
      
      // Generate order ID
      const newOrderId = generateOrderId();
      setOrderId(newOrderId);
      
      // For UPI and Card payments, show payment UI in the same page
      if (paymentMethod === 'upi') {
        // Simulate UPI payment processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Show UPI payment UI instead of redirecting
        setShowUpiPaymentUI(true);
      } else if (paymentMethod === 'card') {
        // Simulate card payment processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Show card payment UI instead of redirecting
        setShowCardPaymentUI(true);
      } else if (paymentMethod === 'COD') {
        // For COD, process the order directly
        try {
          // Fetch fresh cart data before creating order
          console.log('Fetching fresh cart data before COD order creation...');
          const freshCartResponse = await cartApi.getCart();
          const freshCartData = freshCartResponse.data;
          
          if (!freshCartData || !freshCartData.items || freshCartData.items.length === 0) {
            toast.error('Your cart is empty. Please add items to cart first.');
            navigate('/cart');
            return;
          }

          console.log('Fresh cart data before COD order creation:', {
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
            paymentStatus: 'COD',
            discountAmount: 0,
            shippingAmount: 0,
            taxAmount: 0,
            notes: 'Order placed via COD'
          };

          // Create order via API (this will automatically clear the cart)
          await orderApi.createOrder(orderData);
          
          // Clear shipping address
          localStorage.removeItem('shippingAddress');
          
          // Set order placed state to show confirmation
          setOrderPlaced(true);
          
          toast.success('Order placed successfully!');
        } catch (error) {
          console.error('Error creating order:', error);
          toast.error('Failed to create order. Please try again.');
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
        paymentStatus: paymentMethod === 'COD' ? 'COD' : 'Paid',
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
        
        {orderPlaced ? (
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
              <form onSubmit={handleSubmit}>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">Select Payment Method</h2>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center">
                      <input
                        id="COD"
                        name="paymentMethod"
                        type="radio"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <label htmlFor="COD" className="ml-3 block text-sm font-medium text-gray-700">
                        Cash on Delivery (COD)
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="card"
                        name="paymentMethod"
                        type="radio"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
                        Credit/Debit Card
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="upi"
                        name="paymentMethod"
                        type="radio"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <label htmlFor="upi" className="ml-3 block text-sm font-medium text-gray-700">
                        UPI
                      </label>
                    </div>
                  </div>
                </div>
                
                {paymentMethod === 'card' && (
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
                
                {paymentMethod === 'upi' && (
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
                  {loading || processingOrder ? 'Processing Order...' : 'Place Order'}
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