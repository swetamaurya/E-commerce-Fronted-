import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaSignOutAlt, FaUser, FaHome, FaBoxOpen, FaClipboardList, FaChartLine, FaUsers, FaCreditCard, FaWarehouse } from 'react-icons/fa';
import CustomDialog from './CustomDialog';
import Toast from './Toast';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Check if user is admin
      if (userData.role !== 'admin') {
        navigate('/');
        return;
      }
    } else {
      navigate('/');
    }
  }, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowLogoutDialog(false);
    setShowLogoutSuccess(true);
    setTimeout(() => {
      setShowLogoutSuccess(false);
      navigate('/admin/login');
    }, 2000);
  };

  const adminMenuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: FaHome },
    { label: 'Products', path: '/admin/products', icon: FaBoxOpen },
    { label: 'Orders', path: '/admin/orders', icon: FaClipboardList },
    // { label: 'Analytics', path: '/admin/analytics', icon: FaChartLine }, // Commented for now
    { label: 'Users', path: '/admin/users', icon: FaUsers },
    { label: 'Payments', path: '/admin/payments', icon: FaCreditCard },
    { label: 'Inventory', path: '/admin/inventory', icon: FaWarehouse },
  ];

  return (
    <>
      <nav className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Admin Panel Title */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-lg sm:text-xl font-bold text-white">
                  Admin Panel
                </span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Desktop Navigation Menu Items */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`px-2 lg:px-3 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors duration-200 flex items-center space-x-1 lg:space-x-2 ${
                      isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-1"
                title="Logout"
              >
                <FaSignOutAlt className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="text-xs lg:text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-3 ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              {/* Mobile Logout */}
              <div className="border-t border-gray-700 pt-2 mt-2">
                <button
                  onClick={() => {
                    setShowLogoutDialog(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 flex items-center space-x-3"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Logout Confirmation Dialog */}
      <CustomDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        title="Confirm Admin Logout"
        message="Are you sure you want to logout from the admin panel? You will need to login again to access admin features."
        confirmText="Yes, Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        variant="danger"
        splitButtons
      />

      <Toast show={showLogoutSuccess} message="You have been logged out from admin panel successfully" type="success" />
    </>
  );
};

export default AdminNavbar;
