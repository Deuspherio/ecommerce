import React, { useContext, useRef, useState } from "react";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import "./styles/App.scss";
import { Container } from "react-bootstrap";
import ProductPage from "./pages/ProductPage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderPage from "./pages/OrderPage";
import UpdateUserProfilePage from "./pages/UpdateUserProfilePage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import DashboardPage from "./pages/DashboardPage";
import ListOrdersPage from "./pages/ListOrdersPage";
import ListUsersPage from "./pages/ListUsersPage";
import EditUserPage from "./pages/EditUserPage";
import EditProductsPage from "./pages/EditProductsPage";
import ListProductsPage from "./pages/ListProductsPage";
import CreateProductPage from "./pages/CreateProductPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import SearchProductPage from "./pages/SearchProductPage";
import { Store } from "./store";
import Footer from "./components/Footer";

function App() {
  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;
  const [openCart, setOpenCart] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const main = useRef(null);

  if (main && main.current) {
    if (openCart || openMenu) {
      document.body.style.overflowY = "hidden";
      main.current.style.userSelect = "none";
      main.current.style.pointerEvents = "none";
    } else {
      document.body.style.overflowY = "scroll";
      main.current.style.userSelect = "text";
      main.current.style.pointerEvents = "all";
    }
  }

  return (
    <Router>
      <ToastContainer position="bottom-center" limit={1} autoClose={1500} />
      <div className="sizzlingera">
        <div className="header">
          <Header
            openCart={openCart}
            setOpenCart={setOpenCart}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
        </div>
        <div ref={main} className="main">
          <Container className={userData ? "adjusted-container" : ""}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/signin" element={<SigninPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/search" element={<SearchProductPage />} />
              {/* Protected Route */}
              <Route
                path="/shipping"
                element={
                  <ProtectedRoute>
                    <ShippingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/place-order"
                element={
                  <ProtectedRoute>
                    <PlaceOrderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/update-profile"
                element={
                  <ProtectedRoute>
                    <UpdateUserProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="order-history"
                element={
                  <ProtectedRoute>
                    <OrderHistoryPage />
                  </ProtectedRoute>
                }
              />
              {/* Admin Route */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders-list"
                element={
                  <AdminRoute>
                    <ListOrdersPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users-list"
                element={
                  <AdminRoute>
                    <ListUsersPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users-list/user/update-user/:id"
                element={
                  <AdminRoute>
                    <EditUserPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products-list"
                element={
                  <AdminRoute>
                    <ListProductsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products-list/product/update-product/:id"
                element={
                  <AdminRoute>
                    <EditProductsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products-list/product/create-product"
                element={
                  <AdminRoute>
                    <CreateProductPage />
                  </AdminRoute>
                }
              />
            </Routes>
          </Container>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
