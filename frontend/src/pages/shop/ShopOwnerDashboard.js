import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { vehicleService, bookingService } from '../../services/api.service';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';
import { FaCar, FaCalendar, FaRupeeSign, FaRoute } from 'react-icons/fa';

const ShopOwnerDashboard = () => {
  const { shop } = useAuth();
  const location = useLocation();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [location.state?.refresh]);

  const loadDashboardData = async () => {
    try {
      const [vehiclesRes, bookingsRes, statsRes] = await Promise.all([
        vehicleService.getMyShopVehicles(),
        bookingService.getShopBookings(),
        bookingService.getShopStats(),
      ]);
      
      setVehicles(vehiclesRes.data);
      setBookings(bookingsRes.data.slice(0, 5)); // Recent 5 bookings
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId, vehicleName) => {
    if (!window.confirm(`Are you sure you want to delete "${vehicleName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await vehicleService.deleteVehicle(vehicleId);
      toast.success('Vehicle deleted successfully');
      loadDashboardData(); // Reload data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete vehicle');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Shop Dashboard</h1>
            {shop && <p className="text-xl text-gray-800 mt-2">{shop.name}</p>}
          </div>
          <div className="flex gap-3">
            <Link
              to="/shop/bookings"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Manage Bookings
            </Link>
            <Link
              to="/shop/vehicles/add"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              + Add Vehicle
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 font-semibold mb-1">Total Vehicles</p>
                <p className="text-3xl font-bold text-primary-600">{stats?.totalVehicles || 0}</p>
                <p className="text-sm text-green-600 mt-1">{stats?.availableVehicles || 0} available</p>
              </div>
              <FaCar className="text-4xl text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 font-semibold mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.totalBookings || 0}</p>
                <p className="text-sm text-blue-600 mt-1">{stats?.activeBookings || 0} active</p>
              </div>
              <FaCalendar className="text-4xl text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 font-semibold mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">₹{stats?.totalRevenue || 0}</p>
                <p className="text-sm text-green-700 mt-1">{stats?.completedBookings || 0} completed</p>
              </div>
              <FaRupeeSign className="text-4xl text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 font-semibold mb-1">Total Distance</p>
                <p className="text-3xl font-bold text-purple-600">{stats?.totalDistance || 0} km</p>
                <p className="text-sm text-purple-700 mt-1">All vehicles</p>
              </div>
              <FaRoute className="text-4xl text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
              <Link to="/shop/bookings" className="text-primary-600 hover:text-primary-700">
                View All →
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-2">📅</div>
                <p className="text-gray-600">No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{booking.vehicle?.name || 'Vehicle'}</h4>
                        <p className="text-sm text-gray-700">{booking.user?.name || 'Customer'}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600">₹{booking.totalAmount}</p>
                        <p className="text-xs text-gray-600">{booking.totalDays} days</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vehicles */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Vehicles</h2>
              <Link to="/shop/vehicles" className="text-primary-600 hover:text-primary-700">
                View All →
              </Link>
            </div>

            {vehicles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-2">🚗</div>
                <p className="text-gray-600 mb-4">No vehicles added yet</p>
                <Link
                  to="/shop/vehicles/add"
                  className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Add Your First Vehicle
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {vehicles.slice(0, 5).map((vehicle) => (
                  <div
                    key={vehicle._id}
                    className="flex items-center space-x-4 border rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <img
                      src={getImageUrl(vehicle.images?.[0])}
                      alt={vehicle.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={handleImageError}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{vehicle.name}</h4>
                      <p className="text-sm text-gray-600">{vehicle.brand}</p>
                      <p className="text-sm font-semibold text-primary-600 mt-1">
                        ₹{vehicle.dailyRentInINR}/day
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${
                        vehicle.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.available ? 'Available' : 'Unavailable'}
                      </span>
                      <div className="flex gap-2">
                        <Link
                          to={`/shop/vehicles/${vehicle._id}/edit`}
                          className="flex-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition text-center"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle._id, vehicle.name)}
                          className="flex-1 px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition text-center"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerDashboard;
