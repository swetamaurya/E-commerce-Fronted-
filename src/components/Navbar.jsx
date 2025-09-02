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

  // Check for existing user on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or implement search functionality
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const closeMenu = () => setMenuOpen(false);

const handleLoginSuccess = (userData) => {
  setUser(userData);
  setShowLoginModal(false);
  setShowLoginSuccess(true);          // show toast
  setTimeout(() => setShowLoginSuccess(false), 2500);  // auto-hide
};


const handleLogout = () => {
  setShowLogoutDialog(true);   // just open the confirm dialog
};
   

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
        {/* 1) Discount banner - Black background */}
        <div className="w-full bg-black text-white text-center text-xs py-2 px-2">
          <span className="font-medium">GET 10% off upto Rs. 150 on Orders above 1349 | GET10</span>
        </div>

        {/* 2) Main navigation bar */}
        <div className="w-full border-b border-gray-200 bg-white">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between py-4 px-4 sm:px-6">
            
            {/* Left: Search bar */}
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
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

            {/* Right: User and Cart icons */}
            <div className="flex-1 flex justify-end items-center gap-4 sm:gap-6">
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 hidden sm:block">Hi, {user.name}</span>
                  <button 
                    onClick={handleLogout}
                    aria-label="Logout" 
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Logout"
                  >
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
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
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 20a8 8 0 1 1 16 0v1H4v-1z"/>
                  </svg>
                </button>
              )}
              <button 
                onClick={() => { navigate("/wishlist"); closeMenu(); }} 
                aria-label="Wishlist" 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Wishlist"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button 
                onClick={() => { navigate("/cart"); closeMenu(); }} 
                aria-label="Cart" 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                title="Cart"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium">
                  1
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3) Categories navigation */}
        <div className="w-full border-b border-gray-200 bg-white">
          <nav className="max-w-[1200px] mx-auto" aria-label="Main navigation">
            {/* Desktop categories */}
            <ul className="hidden md:flex justify-center text-sm font-semibold text-gray-700">
              {categories.map(({ label, path, description }) => (
                <li key={path} className="relative">
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `block px-6 py-4 ${isActive ? "text-black" : "text-gray-700 hover:text-black"} transition-colors`
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

            {/* Mobile categories button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-full px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:text-black flex items-center justify-between border-b border-gray-100"
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

        {/* 4) Mobile slide menu */}
        {menuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden bg-white border-b shadow-md"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col px-4 py-3 space-y-1 text-sm font-semibold text-gray-700">
              {categories.map(({ label, path, description }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block py-3 px-2 rounded-md ${isActive ? "text-black bg-gray-50" : "text-gray-700 hover:text-black hover:bg-gray-50"} transition-colors`
                    }
                    title={description}
                    aria-label={`Navigate to ${label} page`}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
            
            {/* Mobile search */}
            <div className="px-4 py-3 border-t border-gray-100">
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
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Search"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </button>
              </form>
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

{/* Logout Confirmation Dialog */}
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
<Toast show={showLoginSuccess}  message="You have been logged in successfully"  type="success" />



    </>
  );
}
