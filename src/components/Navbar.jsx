import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginModal from "./LoginModal";
import CustomDialog from "./CustomDialog";
import Toast from "./Toast";

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  const handleLoginSuccess = (userData, isAdmin) => {
    setUser(userData);
    setShowLoginModal(false);
    setShowLoginSuccess(true);
    setTimeout(() => setShowLoginSuccess(false), 2500);
    if (isAdmin) navigate('/admin');
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
      <header className="w-full sticky top-0 z-50 bg-white">
        {/* Discount banner */}
        <div className="w-full bg-black text-white text-center text-xs py-2 px-2">
          <span className="font-medium">GET 10% off upto Rs. 150 on Orders above 1349 | GET10</span>
        </div>
        {/* Main navigation bar */}
        <div className="w-full border-b border-gray-200 bg-white">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between py-4 px-4 sm:px-6">
            {/* Left: Search */}
            <div className="flex-1 max-w-md mr-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
              <Link to="/" className="flex flex-col items-center" onClick={closeMenu}>
                <div className="mb-2">
                  <img 
                    src="/royal-thread-logo.svg" 
                    alt="Royal Thread Logo" 
                    className="h-12 w-auto"
                  />
                </div>
              </Link>
            </div>
            {/* Right: User + wishlist + cart */}
            <div className="flex-1 flex justify-end items-center gap-4 sm:gap-6">
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 hidden sm:block">Hi, {user.name}</span>
                  <span className="text-xs text-gray-700 font-medium block sm:hidden">Hi, {user.name}</span>
                  
                  {/* Admin Link - Only show for admin users */}
                  {user.role === 'admin' && (
                    <button 
                      onClick={() => navigate('/admin')}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="Admin Panel"
                    >
                      <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    aria-label="Logout" 
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Logout"
                  >
                    {/* Logout Icon */}
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowLoginModal(true)} 
                  aria-label="Login" 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Login"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 20a8 8 0 1 1 16 0v1H4v-1z"/>
                  </svg>
                </button>
              )}
              {/* Wishlist icon - outlined, always visible, no fill */}
              <button 
                onClick={() => { navigate("/wishlist"); closeMenu(); }} 
                aria-label="Wishlist" 
                className="p-2 transition-colors"
                title="Wishlist"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="#232323" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              {/* Cart */}
              <button 
                onClick={() => { navigate("/cart"); closeMenu(); }} 
                aria-label="Cart" 
                className="p-2 transition-colors relative"
                title="Cart"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="#222" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium">
                  1
                </span>
              </button>
            </div>
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
          <div className="md:hidden bg-white border-b border-gray-200">
            <div className="px-4 py-2">
              {/* Admin Panel Link for Mobile */}
              {user && user.role === 'admin' && (
                <button
                  onClick={() => {
                    navigate('/admin');
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md mb-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Admin Panel</span>
                </button>
              )}
              
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
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={confirmLogout}
        variant="blue"
        splitButtons
      />
      <Toast show={showLogoutSuccess} message="You have been logged out successfully" type="success" />
      <Toast show={showLoginSuccess} message="You have been logged in successfully" type="success" />
    </>
  );
}
