import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AdminLayout from "./components/AdminLayout";
import ProductLayout from "./components/ProductLayout";
import UserLayout from "./components/UserLayout";
import CartPage from "./pages/CartPage";
import CreateProductPage from "./pages/CreateProductPage";
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
import UpdateUserPage from "./pages/UpdateUserPage";
import UsersListPage from "./pages/UsersListPage";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomerRoute from "./components/CustomerRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProductLayout />,
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
        path: "/product/:slug",
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
        path: "/user/order/shipping",
        element: (
          <CustomerRoute>
            <ShippingPage />
          </CustomerRoute>
        ),
      },
      {
        path: "/user/order/place-order",
        element: (
          <CustomerRoute>
            <PlaceOrderPage />
          </CustomerRoute>
        ),
      },
      {
        path: "/user/order/:id",
        element: <OrderPage />,
      },
      {
        path: "/user/order/history",
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
        path: "/admin/products/create",
        element: (
          <ProtectedRoute>
            <CreateProductPage />
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
        path: "/admin/users/",
        element: (
          <ProtectedRoute>
            <UsersListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/users/:id",
        element: (
          <ProtectedRoute>
            <UpdateUserPage />
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
    ],
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
