import { API_URL, RAZORPAY_KEY_ID } from '../config';

// Razorpay payment utility
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    console.log('Loading Razorpay SDK...');
    
    if (window.Razorpay) {
      console.log('Razorpay already loaded');
      resolve(window.Razorpay);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('Razorpay SDK loaded successfully');
      resolve(window.Razorpay);
    };
    script.onerror = (error) => {
      console.error('Failed to load Razorpay SDK:', error);
      resolve(null);
    };
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount, currency = 'INR') => {
  try {
    console.log('Creating Razorpay order for amount:', amount);
    console.log('API URL:', `${API_URL}/payments/create-order`);
    
    const response = await fetch(`${API_URL}/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay expects amount in paise
        currency: currency
      })
    });
    
    console.log('Razorpay order response status:', response.status);
    const data = await response.json();
    console.log('Razorpay order response data:', data);
    return data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

export const openRazorpayPayment = async (orderData, onSuccess, onError) => {
  try {
    console.log('Opening Razorpay payment with order data:', orderData);
    
    const Razorpay = await loadRazorpay();
    
    if (!Razorpay) {
      throw new Error('Razorpay SDK failed to load');
    }

    console.log('Razorpay SDK loaded, creating payment options...');

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Royal Thread',
      description: 'Payment for your order',
      order_id: orderData.id,
      handler: function (response) {
        console.log('Payment successful:', response);
        onSuccess(response);
      },
      prefill: {
        name: orderData.customer_name || '',
        email: orderData.customer_email || '',
        contact: orderData.customer_phone || ''
      },
      notes: {
        order_id: orderData.order_id || ''
      },
      theme: {
        color: '#14b8a6'
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal dismissed');
          onError('Payment cancelled by user');
        }
      }
    };

    console.log('Razorpay options:', options);
    const razorpayInstance = new Razorpay(options);
    console.log('Opening Razorpay modal...');
    razorpayInstance.open();
    
    return razorpayInstance;
  } catch (error) {
    console.error('Error opening Razorpay payment:', error);
    onError(error.message);
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const response = await fetch(`${API_URL}/payments/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(paymentData)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};
