import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CottonYogaMats from "./pages/CottonYogaMats";
import BedsideRunners from "./pages/BedsideRunners";
import MatsCollection from "./pages/MatsCollection";
import BathMats from "./pages/BathMats";
import AreaRugs from "./pages/AreaRugs";
import ProductDetailPage from "./pages/ProductDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import AccountPage from "./pages/AccountPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import AddressPage from "./pages/AddressPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import OrderTrackingPage from "./pages/OrderTrackingPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// comment
export default function App() {
  return (
    <>
      <Navbar />
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
        <Route path="/account" element={<AccountPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-tracking" element={<OrderTrackingPage />} />
        <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminPage />} requiredRole="admin" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}
