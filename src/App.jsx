import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SupportWidget from "./components/SupportWidget";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutAddress from "./pages/CheckoutAddress";
import CheckoutPayment from "./pages/CheckoutPayment";
import CheckoutConfirm from "./pages/CheckoutConfirm";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import ChangePassword from "./pages/ChangePassword";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import ScrollToTop from "./components/ScrollToTop.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import TermsOfServices from "./pages/TermsOfServices";

// Layout wrapper for storefront
const StorefrontLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />}>
            <Route
              index
              element={<Navigate to="/checkout/address" replace />}
            />
            <Route path="address" element={<CheckoutAddress />} />
            <Route path="payment" element={<CheckoutPayment />} />
            <Route path="confirm" element={<CheckoutConfirm />} />
            <Route path="success" element={<CheckoutSuccess />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<UpdateProfile />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:slug" element={<CategoryDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/terms-of-services" element={<TermsOfServices />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />

          <Routes>
            {/* Storefront Layout */}
            <Route path="/*" element={<StorefrontLayout />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
