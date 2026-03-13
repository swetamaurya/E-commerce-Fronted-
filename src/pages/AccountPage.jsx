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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Visual content */}
            <div className="hidden md:flex flex-col items-center justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-12 border border-teal-100">
                  <div className="text-center">
                    <div className="inline-block bg-gradient-to-br gray-900 rounded-full p-6 mb-6">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome Back</h3>
                    <p className="text-gray-600 text-lg mb-2">Access your account to:</p>
                    <ul className="text-left space-y-3 text-gray-600">
                      <li className="flex items-center gap-3">
                        <span className="text-gray-900 font-bold">✓</span>
                        <span>View order history</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-gray-900 font-bold">✓</span>
                        <span>Track shipments</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-gray-900 font-bold">✓</span>
                        <span>Manage wishlist</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-gray-900 font-bold">✓</span>
                        <span>Save addresses</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Login prompt */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <h1 className="page-title text-gray-900 mb-3">My Account</h1>
                  <p className="text-gray-600 text-lg">Sign in to manage your profile and orders</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-lg hover:bg-gray-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0 mb-4"
                  >
                    Sign In / Register
                  </button>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                    </div>
                  </div>

                  <p className="text-center text-gray-600 text-sm mb-6">
                    Click on "Register" in the form above to create a new account and start shopping with us.
                  </p>

                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-teal-900">
                        <strong>Pro tip:</strong> Create an account to get personalized recommendations and faster checkout!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-4 sm:py-6 pb-8 sm:pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div>
              <h1 className="page-title text-gray-900">My Account</h1>
              <p className="text-gray-500 text-sm sm:text-base mt-2">Manage your profile and preferences</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-blue-600 hover:bg-blue-50 transition-all border border-blue-200 text-sm sm:text-base"
              >
                <FaKey className="w-4 h-4" />
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition-all border border-red-200 text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Account Information Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-blue-50">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="section-title text-gray-900">{user.name || 'Account'}</h2>
                <p className="text-gray-600 text-sm mt-1">Welcome back to your account</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Full Name */}
              <div className="pb-6 sm:pb-0 border-b sm:border-b-0">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Full Name</p>
                </div>
                <p className="text-base sm:text-lg font-semibold text-gray-900 ml-8">{user.name || '—'}</p>
              </div>

              {/* Email Address */}
              <div className="pb-6 sm:pb-0 border-b sm:border-b-0">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Email Address</p>
                </div>
                <p className="text-base sm:text-lg font-semibold text-gray-900 ml-8 break-all">{user.email || '—'}</p>
              </div>

              {/* Mobile Number */}
              <div className="pb-6 sm:pb-0">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Mobile Number</p>
                </div>
                <p className="text-base sm:text-lg font-semibold text-gray-900 ml-8">{user.mobile || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div
            onClick={() => navigate('/orders')}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md hover:border-teal-200 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-teal-100 group-hover:bg-teal-200 transition-colors">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">My Orders</h3>
                <p className="text-gray-500 text-sm mt-0.5">View and track your orders</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div
            onClick={() => navigate('/wishlist')}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md hover:border-pink-200 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-pink-100 group-hover:bg-pink-200 transition-colors">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">My Wishlist</h3>
                <p className="text-gray-500 text-sm mt-0.5">View your saved items</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <FaLock className="w-5 h-5 text-blue-600" />
                    </div>
                    Password Reset
                  </h3>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordEmail('');
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleForgotPassword} className="p-6 sm:p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-gray-900"
                    required
                  />
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>How it works:</strong> We'll send a password reset link to your email. Click the link in your email to create a new password.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordEmail('');
                    }}
                    className="flex-1 px-4 py-3 text-sm sm:text-base font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="flex-1 px-4 py-3 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {forgotPasswordLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FaKey className="w-4 h-4" />
                        <span>Send Link</span>
                      </>
                    )}
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
