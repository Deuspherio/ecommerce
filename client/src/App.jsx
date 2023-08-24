import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AdminLayout from "./components/AdminLayout";
import ProductLayout from "./components/ProductLayout";
import UserLayout from "./components/UserLayout";
import CartPage from "./pages/CartPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import OrdersHistoryPage from "./pages/OrdersHistoryPage";
import OrderPage from "./pages/OrderPage";
import OrdersListPage from "./pages/OrdersListPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import ProductPage from "./pages/ProductPage";
import ProductsListPage from "./pages/ProductsListPage";
import SearchPage from "./pages/SearchPage";
import ShippingPage from "./pages/ShippingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import UpdateProductPage from "./pages/UpdateProductPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import UsersListPage from "./pages/UsersListPage";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomerRoute from "./components/CustomerRoute";
import MainLayout from "./components/MainLayout";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import UpdateDeliveryPage from "./pages/UpdateDeliveryPage";
import UpdatePaymentPage from "./pages/UpdatePaymentPage";
import UpdatePricesPage from "./pages/UpdatePricesPage";
import NotFoundPage from "./pages/NotFoundPage";
import FrequentlyAskedPage from "./pages/FrequentlyAskedPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: (
          <CustomerRoute>
            <HomePage />
          </CustomerRoute>
        ),
      },
      {
        path: "/about",
        element: (
          <CustomerRoute>
            <AboutPage />
          </CustomerRoute>
        ),
      },
      {
        path: "/contact",
        element: (
          <CustomerRoute>
            <ContactPage />
          </CustomerRoute>
        ),
      },
      {
        path: "/faq",
        element: (
          <CustomerRoute>
            <FrequentlyAskedPage />
          </CustomerRoute>
        ),
      },
    ],
  },
  {
    path: "/products",
    element: <ProductLayout />,
    children: [
      {
        path: "/products/slug/:slug",
        element: (
          <CustomerRoute>
            <ProductPage />
          </CustomerRoute>
        ),
      },
      {
        path: "/products/cart",
        element: (
          <CustomerRoute>
            <CartPage />
          </CustomerRoute>
        ),
      },
      {
        path: "/products/search",
        element: (
          <CustomerRoute>
            <SearchPage />
          </CustomerRoute>
        ),
      },
    ],
  },
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      {
        path: "/user/signin",
        element: <SignInPage />,
      },
      {
        path: "/user/signup",
        element: <SignUpPage />,
      },
      {
        path: "/user/profile",
        element: <UpdateProfilePage />,
      },
      {
        path: "/user/orders/shipping",
        element: (
          <CustomerRoute>
            <ShippingPage />
          </CustomerRoute>
        ),
      },
      {
        path: "/user/orders/place-order",
        element: (
          <CustomerRoute>
            <PlaceOrderPage />
          </CustomerRoute>
        ),
      },
      {
        path: "/user/orders/:id",
        element: <OrderPage />,
      },
      {
        path: "/user/orders/update/delivery/:id",
        element: <UpdateDeliveryPage />,
      },
      {
        path: "/user/orders/history",
        element: (
          <CustomerRoute>
            <OrdersHistoryPage />
          </CustomerRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "/admin/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/products/",
        element: (
          <ProtectedRoute>
            <ProductsListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/products/:id",
        element: (
          <ProtectedRoute>
            <UpdateProductPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/products/update/prices",
        element: (
          <ProtectedRoute>
            <UpdatePricesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/users/",
        element: (
          <ProtectedRoute>
            <UsersListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/orders/",
        element: (
          <ProtectedRoute>
            <OrdersListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/orders/update/payment/:id",
        element: <UpdatePaymentPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

const App = () => {
  return (
    <>
      <ToastContainer position="bottom-center" limit={1} autoClose={1500} />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
