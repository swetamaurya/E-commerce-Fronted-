import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';

export default function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);

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
          <button 
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Logout
          </button>
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
      
    </div>
  );
}
