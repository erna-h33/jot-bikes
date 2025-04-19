import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Route, RouterProvider, createRoutesFromElements } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/features/store.js';

// Private Route
import PrivateRoute from './components/PrivateRoute.jsx';

// Auth
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';

// User
import Profile from './pages/User/Profile.jsx';

// Admin
import AdminRoute from './pages/Admin/AdminRoute.jsx';
import UserList from './pages/Admin/UserList.jsx';
import Dashboard from './pages/Admin/Dashboard.jsx';
import CategoryList from './pages/Admin/CategoryList.jsx';
import ProductList from './pages/Admin/ProductList.jsx';
import ProductUpdate from './pages/Admin/ProductUpdate.jsx';
import AllProducts from './pages/Admin/AllProducts.jsx';
import AdminBookings from './pages/Admin/AdminBookings.jsx';
import UserDetails from './pages/Admin/UserDetails.jsx';

// Vendor
import VendorRoute from './pages/Vendor/VendorRoute.jsx';
import VendorDashboard from './pages/Vendor/Dashboard.jsx';
import VendorProducts from './pages/Vendor/Products.jsx';
import AddProduct from './pages/Vendor/AddProduct.jsx';
import VendorProductUpdate from './pages/Vendor/VendorProductUpdate.jsx';
import VendorBookings from './pages/Vendor/VendorBookings.jsx';

// Pages
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import ProductDetails from './pages/Products/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Shop from './pages/Shop.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import FeedbackForm from './pages/Feedback/FeedbackForm';
import MyFeedback from './pages/Feedback/MyFeedback';
import FeedbackManagement from './pages/Feedback/FeedbackManagement';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shop" element={<Shop />} />

      {/* Private Route */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="userlist" element={<UserList />} />
        <Route path="user/:id" element={<UserDetails />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="product/update/:id" element={<ProductUpdate />} />
        <Route path="allproductslist" element={<AllProducts />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="feedback" element={<FeedbackManagement />} />
      </Route>

      {/* Vendor Routes */}
      <Route path="/vendor" element={<VendorRoute />}>
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="products" element={<VendorProducts />} />
        <Route path="products/new" element={<AddProduct />} />
        <Route path="products/update/:id" element={<VendorProductUpdate />} />
        <Route path="bookings" element={<VendorBookings />} />
      </Route>

      {/* Feedback Routes */}
      <Route path="/feedback" element={<FeedbackForm />} />
      <Route
        path="/my-feedback"
        element={
          <PrivateRoute>
            <MyFeedback />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/feedback"
        element={
          <AdminRoute>
            <FeedbackManagement />
          </AdminRoute>
        }
      />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
