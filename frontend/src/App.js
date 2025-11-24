import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VehicleList from './pages/VehicleList';
import VehicleDetail from './pages/VehicleDetail';
import SearchVehicles from './pages/SearchVehicles';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import BookingDetail from './pages/customer/BookingDetail';
import Payment from './pages/customer/Payment';
import ShopOwnerDashboard from './pages/shop/ShopOwnerDashboard';
import ManageBookings from './pages/shop/ManageBookings';
import AddVehicle from './pages/shop/AddVehicle';
import EditVehicle from './pages/shop/EditVehicle';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-20">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/vehicles" element={<VehicleList />} />
              <Route path="/search" element={<SearchVehicles />} />
              <Route path="/vehicles/:id" element={<VehicleDetail />} />

              {/* Customer Routes */}
              <Route
                path="/customer/dashboard"
                element={
                  <PrivateRoute allowedRoles={['customer']}>
                    <CustomerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/customer/bookings/:id"
                element={
                  <PrivateRoute allowedRoles={['customer']}>
                    <BookingDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/customer/payment"
                element={
                  <PrivateRoute allowedRoles={['customer']}>
                    <Payment />
                  </PrivateRoute>
                }
              />

              {/* Shop Owner Routes */}
              <Route
                path="/shop/dashboard"
                element={
                  <PrivateRoute allowedRoles={['shop_owner']}>
                    <ShopOwnerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/shop/bookings"
                element={
                  <PrivateRoute allowedRoles={['shop_owner']}>
                    <ManageBookings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/shop/vehicles"
                element={
                  <PrivateRoute allowedRoles={['shop_owner']}>
                    <ShopOwnerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/shop/vehicles/add"
                element={
                  <PrivateRoute allowedRoles={['shop_owner']}>
                    <AddVehicle />
                  </PrivateRoute>
                }
              />
              <Route
                path="/shop/vehicles/:id/edit"
                element={
                  <PrivateRoute allowedRoles={['shop_owner']}>
                    <EditVehicle />
                  </PrivateRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
