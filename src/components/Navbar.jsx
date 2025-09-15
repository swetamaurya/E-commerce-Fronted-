import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import LoginModal from "./LoginModal";
import CustomDialog from "./CustomDialog";
import Toast from "./Toast";
import Logo from "./Logo";

const categories = [
  { label: "COTTON YOGA MATS", path: "/cotton-yoga-mats", description: "Premium cotton yoga mats for comfortable practice" },
  { label: "BEDSIDE RUNNERS",  path: "/bedside-runners", description: "Elegant bedside runners for bedroom decor" },
  { label: "MATS COLLECTION",  path: "/mats-collection", description: "Complete collection of home and yoga mats" },
  { label: "BATH MATS",        path: "/bath-mats", description: "Luxurious bath mats for bathroom comfort" },
  { label: "AREA RUGS",        path: "/area-rugs", description: "Beautiful area rugs for home decoration" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Clear search when navigating to other pages
  useEffect(() => {
    // Clear search query when not on all-products page
    if (!pathname.includes('/all-products')) {
      setSearchQuery('');
    } else {
      // If on all-products page, sync search query from URL
      const urlParams = new URLSearchParams(window.location.search);
      const search = urlParams.get('search');
      if (search) {
        setSearchQuery(search);
      } else {
        setSearchQuery('');
      }
    }
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Scroll to top before navigation
      window.scrollTo({ top: 0, behavior: "instant" });
      // Navigate to all products page with search query
      navigate(`/all-products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (value) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (value.trim()) {
            // Scroll to top before navigation
            window.scrollTo({ top: 0, behavior: "instant" });
            // Navigate to all products page with search query
            navigate(`/all-products?search=${encodeURIComponent(value.trim())}`);
          } else {
            // If search is cleared, go to all products
            navigate('/all-products');
          }
        }, 300); // 300ms delay
      };
    })(),
    [navigate]
  );

  // Real-time search handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const closeMenu = () => setMenuOpen(false);
  const closeUserMenu = () => setUserMenuOpen(false);

  const handleLoginSuccess = (userData, isAdmin) => {
    setUser(userData);
    setShowLoginModal(false);
    setShowLoginSuccess(true);
    setTimeout(() => setShowLoginSuccess(false), 2500);
    // Admin navigation removed - admin panel should be accessed directly via URL
  };

  const handleLogout = () => setShowLogoutDialog(true);

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowLogoutDialog(false);
    navigate("/");
    setShowLogoutSuccess(true);
    setTimeout(() => setShowLogoutSuccess(false), 2500);
  };

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-white isolation-auto">
        {/* Discount banner */}
        <div className="w-full bg-black text-white text-center text-xs py-2 px-2">
          <span className="font-medium">GET 10% off upto Rs. 150 on Orders above 1349 | GET10</span>
        </div>
        {/* Main navigation bar */}
        <div className="w-full border-b border-gray-200 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between py-1 sm:py-2 md:py-3 px-3 sm:px-4 md:px-6 lg:px-8">
            {/* Mobile: Logo + Icons */}
            <div className="flex items-center justify-between w-full md:hidden">
              {/* Mobile Logo */}
              <Link to="/" className="flex items-center" onClick={closeMenu}>
                <Logo size="small" />
              </Link>
              
              {/* Mobile Icons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {user ? (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-700 font-medium">Hi, {user.name.split(' ')[0]}</span>
                    
                    {/* Mobile User Menu Dropdown */}
                    <div className="relative user-menu-container">
                      <button 
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="User Menu"
                      >
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      
                      {/* Mobile User Menu Dropdown */}
                      {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                          <button
                            onClick={() => { navigate("/wishlist"); closeUserMenu(); }}
                            className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                          >
                            <svg className="h-3 w-3 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Wishlist
                          </button>
                          <button
                            onClick={() => { navigate("/orders"); closeUserMenu(); }}
                            className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                          >
                            <svg className="h-3 w-3 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Orders
                          </button>
                          <button
                            onClick={() => { navigate("/account"); closeUserMenu(); }}
                            className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                          >
                            <svg className="h-3 w-3 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile
                          </button>
                          <button
                            onClick={() => { navigate("/address"); closeUserMenu(); }}
                            className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                          >
                            <svg className="h-3 w-3 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Address
                          </button>
                          <div className="border-t border-gray-100"></div>
                          <button
                            onClick={() => { handleLogout(); closeUserMenu(); }}
                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <svg className="h-3 w-3 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowLoginModal(true)} 
                    aria-label="Login" 
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Login"
                  >
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 20a8 8 0 1 1 16 0v1H4v-1z"/>
                    </svg>
                  </button>
                )}
                
                {/* Cart - Separate */}
                <button 
                  onClick={() => { navigate("/cart"); closeMenu(); }} 
                  aria-label="Cart" 
                  className="p-1 transition-colors"
                  title="Cart"
                >
                  <svg className="h-4 w-4" fill="none" stroke="#222" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                </button>
              </div>
            </div>


            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between w-full">
            {/* Left: Search */}
            <div className="flex-1 max-w-md mr-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  aria-label="Search"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </button>
              </form>
            </div>
              
            {/* Center: Logo */}
            <div className="flex-1 flex justify-center">
               <Link to="/" className="flex items-center" onClick={closeMenu}>
                  <Logo size="large" />
               </Link>
            </div>
              
            {/* Right: User + wishlist + cart */}
              <div className="flex-1 flex justify-end items-center gap-4 lg:gap-6">
              {user ? (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 hidden lg:block">Hi, {user.name}</span>
                    <span className="text-sm text-gray-700 font-medium lg:hidden">Hi, {user.name.split(' ')[0]}</span>
                  
                  {/* User Menu Dropdown */}
                  <div className="relative user-menu-container">
                    <button 
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="User Menu"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    
                    {/* User Menu Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                        <button
                          onClick={() => { navigate("/wishlist"); closeUserMenu(); }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Wishlist
                        </button>
                        <button
                          onClick={() => { navigate("/orders"); closeUserMenu(); }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Orders
                        </button>
                        <button
                          onClick={() => { navigate("/account"); closeUserMenu(); }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </button>
                        <button
                          onClick={() => { navigate("/address"); closeUserMenu(); }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Address
                        </button>
                        <div className="border-t border-gray-100"></div>
                  <button 
                          onClick={() => { handleLogout(); closeUserMenu(); }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                          Logout
                  </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowLoginModal(true)} 
                  aria-label="Login" 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Login"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 20a8 8 0 1 1 16 0v1H4v-1z"/>
                  </svg>
                </button>
              )}
                
              {/* Cart */}
              <button 
                onClick={() => { navigate("/cart"); closeMenu(); }} 
                aria-label="Cart" 
                className="p-2 transition-colors"
                title="Cart"
              >
                  <svg className="h-5 w-5" fill="none" stroke="#222" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        </div>


        {/* Mobile Search Bar */}
        <div className="w-full border-b border-gray-200 bg-white md:hidden">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
            <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    aria-label="Search products"
                  />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                aria-label="Search"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Categories Navigation */}
        <div className="w-full border-b border-gray-200 bg-white">
          <nav className="max-w-[1200px] mx-auto" aria-label="Main navigation">
            <ul className="hidden md:flex justify-center text-sm font-semibold text-gray-700">
              {categories.map(({ label, path, description }) => (
                <li key={path} className="relative">
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `block px-6 py-4 ${isActive ? "text-black" : "text-gray-700"} transition-colors`
                    }
                    title={description}
                    aria-label={`Navigate to ${label} page`}
                  >
                    {label}
                    <span className={`absolute left-0 right-0 -bottom-[1px] h-0.5 ${pathname === path ? "bg-black" : "bg-transparent"}`} />
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-full px-4 py-3 text-left text-sm font-semibold text-gray-700 flex items-center justify-between border-b border-gray-100"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                <span>Browse Categories</span>
                <svg className={`h-5 w-5 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 relative z-50 overflow-hidden">
            <div className="px-4 py-2">
              {categories.map(({ label, path, description }) => (
                <Link
                  key={path}
                  to={path}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      {/* Logout Dialog */}
      <CustomDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to access your account."
        confirmText="Yes, Logout"
        cancelText="Cancel"
        onConfirm={confirmLogout}
        variant="danger"
        splitButtons
      />
      <Toast show={showLogoutSuccess} message="You have been logged out successfully" type="success" />
      <Toast show={showLoginSuccess} message="Welcome! You have been logged in successfully" type="success" />
    </>
  );
}
