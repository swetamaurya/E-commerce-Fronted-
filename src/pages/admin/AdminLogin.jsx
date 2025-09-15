import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_URL } from '../../config';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting admin login with:', { email: formData.email, url: `${API_URL}/auth/login` });
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (response.ok && data.success) {
        // Check if user is admin
        if (data.data.user.role !== 'admin') {
          toast.error('Access denied. Admin privileges required.');
          return;
        }

        // Store token and user data
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        toast.success('Welcome back, Admin!');
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        console.error('Login failed:', data);
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <FaShieldAlt className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Access the admin panel with your credentials
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-6 px-5 shadow-xl rounded-lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-9 pr-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-9 pr-9 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4" />
                    ) : (
                      <FaEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In to Admin Panel'
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              This is a secure admin area. Only authorized personnel should access this page.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              ← Back to Main Site
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaShieldAlt className="h-4 w-4 text-blue-400" />
            </div>
            <div className="ml-2">
              <h3 className="text-xs font-medium text-blue-800">
                Security Notice
              </h3>
              <div className="mt-1 text-xs text-blue-700">
                <p>
                  This admin login is separate from the main site. Your admin session will not affect your regular user account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
