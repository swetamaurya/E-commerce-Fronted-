import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CottonYogaMats from "./pages/CottonYogaMats";
import BedsideRunners from "./pages/BedsideRunners";
import MatsCollection from "./pages/MatsCollection";
import BathMats from "./pages/BathMats";
import AreaRugs from "./pages/AreaRugs";
import ProductDetailPage from "./pages/ProductDetailPage";
import AllProductsPage from "./pages/AllProductsPage";
import NotFoundPage from "./pages/NotFoundPage";
import AccountPage from "./pages/AccountPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import AddressPage from "./pages/AddressPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import OrderTrackingPage from "./pages/OrderTrackingPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import OrderDetailsPage from "./pages/OrderDetailsPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminLogin from "./pages/admin/AdminLogin";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ReturnPage from "./pages/ReturnPage";
import ShippingPage from "./pages/ShippingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import GoToTopButton from "./components/GoToTopButton";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  // Check if current route is admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cotton-yoga-mats" element={<CottonYogaMats />} />
        <Route path="/cotton-yoga-mats/:productId" element={<ProductDetailPage />} />
        <Route path="/bedside-runners" element={<BedsideRunners />} />
        <Route path="/bedside-runners/:productId" element={<ProductDetailPage />} />
        <Route path="/mats-collection" element={<MatsCollection />} />
        <Route path="/mats-collection/:productId" element={<ProductDetailPage />} />
        <Route path="/bath-mats" element={<BathMats />} />
        <Route path="/bath-mats/:productId" element={<ProductDetailPage />} />
        <Route path="/area-rugs" element={<AreaRugs />} />
        <Route path="/area-rugs/:productId" element={<ProductDetailPage />} />
        <Route path="/all-products" element={<AllProductsPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/order-details/:orderId" element={<OrderDetailsPage />} />
        <Route path="/order-tracking" element={<OrderTrackingPage />} />
        <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/return" element={<ReturnPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/test" element={<div className="p-8"><h1 className="text-2xl font-bold">Admin Test Page</h1><p>If you can see this, routing is working!</p></div>} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminPage />} requiredRole="admin" />} />
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><AdminOrdersPage /></AdminLayout>} />
        <Route path="/admin/analytics" element={<AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p className="text-gray-600">Coming soon...</p></div></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
        <Route path="/admin/payments" element={<AdminLayout><AdminPayments /></AdminLayout>} />
        <Route path="/admin/inventory" element={<AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Inventory</h1><p className="text-gray-600">Coming soon...</p></div></AdminLayout>} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <GoToTopButton />}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
