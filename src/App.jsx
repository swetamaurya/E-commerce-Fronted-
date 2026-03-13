import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GoToTopButton from "./components/GoToTopButton";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load all pages for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const CottonYogaMats = lazy(() => import("./pages/CottonYogaMats"));
const BedsideRunners = lazy(() => import("./pages/BedsideRunners"));
const MatsCollection = lazy(() => import("./pages/MatsCollection"));
const BathMats = lazy(() => import("./pages/BathMats"));
const AreaRugs = lazy(() => import("./pages/AreaRugs"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const AllProductsPage = lazy(() => import("./pages/AllProductsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const AddressPage = lazy(() => import("./pages/AddressPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const OrderTrackingPage = lazy(() => import("./pages/OrderTrackingPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));
const RatingsPage = lazy(() => import("./pages/RatingsPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const ReturnPage = lazy(() => import("./pages/ReturnPage"));
const ShippingPage = lazy(() => import("./pages/ShippingPage"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

const PageLoader = () => (
  <div className="min-h-[70vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

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
      <Suspense fallback={<PageLoader />}>
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
          <Route path="/ratings/:productId" element={<RatingsPage />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/return" element={<ReturnPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Suspense fallback={<PageLoader />}><ProtectedRoute element={<AdminPage />} requiredRole="admin" /></Suspense>} />
          <Route path="/admin/dashboard" element={<Suspense fallback={<PageLoader />}><AdminLayout><AdminDashboard /></AdminLayout></Suspense>} />
          <Route path="/admin/products" element={<Suspense fallback={<PageLoader />}><AdminLayout><AdminProducts /></AdminLayout></Suspense>} />
          <Route path="/admin/orders" element={<Suspense fallback={<PageLoader />}><AdminLayout><AdminOrdersPage /></AdminLayout></Suspense>} />
          <Route path="/admin/users" element={<Suspense fallback={<PageLoader />}><AdminLayout><AdminUsers /></AdminLayout></Suspense>} />
          <Route path="/admin/payments" element={<Suspense fallback={<PageLoader />}><AdminLayout><AdminPayments /></AdminLayout></Suspense>} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <GoToTopButton />}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
