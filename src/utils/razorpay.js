import { API_URL, RAZORPAY_KEY_ID } from '../config';

// Razorpay payment utility
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(window.Razorpay);
    };
    script.onerror = () => {
      resolve(null);
    };
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount, currency = 'INR') => {
  try {
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

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const openRazorpayPayment = async (orderData, onSuccess, onError) => {
  try {
    const Razorpay = await loadRazorpay();

    if (!Razorpay) {
      throw new Error('Razorpay SDK failed to load');
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Royal Thread',
      description: 'Payment for your order',
      order_id: orderData.id,
      handler: function (response) {
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
          onError('Payment cancelled by user');
        }
      }
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();

    return razorpayInstance;
  } catch (error) {
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
    throw error;
  }
};
