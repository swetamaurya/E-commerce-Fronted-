// API configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Backend URL Configuration - Comment/Uncomment as needed
// Option 1: Local Development
// export const BASE_URL = 'http://localhost:5000';

// Option 2: Production Server
export const BASE_URL = 'https://e-commerce-backend-r6s0.onrender.com';

// Option 3: Environment Variable (if you want to use .env file)
// export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Full API URL (with /api)
export const API_URL = `${BASE_URL}/api`;

// Razorpay configuration
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890';