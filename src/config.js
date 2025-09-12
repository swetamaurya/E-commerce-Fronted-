// API configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Use environment variable if available, otherwise fallback to hardcoded URL
export const API_URL = import.meta.env.VITE_API_URL || 
  (isDevelopment ? 'http://localhost:5002/api' : 'https://e-commerce-backend-r6s0.onrender.com/api');