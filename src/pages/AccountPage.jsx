import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaKey, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoginModal from '../components/LoginModal';
import { API_URL } from '../config';

export default function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
    
    // Check if there's a return URL saved
    const returnUrl = localStorage.getItem('returnToUrl');
    if (returnUrl) {
      localStorage.removeItem('returnToUrl');
      navigate(returnUrl);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setForgotPasswordLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Password reset link sent to your email');
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
      } else {
        toast.error(data.message || 'Failed to send reset link');
      }
    } catch (error) {
      console.error('Error sending forgot password request:', error);
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="grid md:grid-cols-2 min-h-[80vh]">
        {/* left side image */}
        <div className="hidden md:flex items-center justify-center bg-gray-50">
          <img
            src="https://dummyimage.com/400x400/eee/000&text=Account+Image"
            alt="account"
            className="max-h-[400px] object-contain"
          />
        </div>

        {/* right side login prompt */}
        <div className="flex items-center justify-center p-8">
          <div className="max-w-sm w-full text-center">
            <h1 className="text-2xl font-semibold mb-6">My Account</h1>
            <p className="mb-6 text-gray-600">Please log in to view your account details</p>
            <button 
              onClick={() => setShowLoginModal(true)}
              className="w-full bg-black text-white py-3 font-semibold"
            >
              LOGIN / REGISTER
            </button>
            <LoginModal 
              isOpen={showLoginModal}
              onClose={() => setShowLoginModal(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 border-b pb-2">My Account</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Account Information</h2>
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowForgotPassword(true)}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <FaKey className="w-4 h-4 mr-1" />
              Change Password
            </button>
            <button 
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 text-sm mb-1">Full Name</p>
            <p className="font-medium text-lg">{user.name || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Email Address</p>
            <p className="font-medium text-lg">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Mobile Number</p>
            <p className="font-medium text-lg">{user.mobile || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FaLock className="w-5 h-5 mr-2 text-blue-600" />
                Change Password
              </h3>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordEmail('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> A password reset link will be sent to your email address. 
                  Please check your inbox and follow the instructions to reset your password.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {forgotPasswordLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaKey className="w-4 h-4 mr-2" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
}
