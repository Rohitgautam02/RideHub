import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import api from '../../utils/api';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';
import { FaUsers, FaStore, FaCar, FaCalendarCheck, FaMoneyBillWave, FaTrash, FaBan, FaCheckCircle } from 'react-icons/fa';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalShops: 0,
    totalVehicles: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Load all data
      const [usersRes, shopsRes, vehiclesRes, bookingsRes] = await Promise.all([
        api.get('/users'),
        api.get('/shops'),
        api.get('/vehicles'),
        api.get('/bookings/all')
      ]);

      const users = usersRes.data.data || usersRes.data || [];
      const shops = shopsRes.data.data || shopsRes.data || [];
      const vehicles = vehiclesRes.data.data || vehiclesRes.data || [];
      const bookings = bookingsRes.data.data || bookingsRes.data || [];

      setUsers(users);
      setShops(shops);
      setVehicles(vehicles);
      setBookings(bookings);

      // Calculate stats
      const totalRevenue = bookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      setStats({
        totalUsers: users.length,
        totalShops: shops.length,
        totalVehicles: vehicles.length,
        totalBookings: bookings.length,
        totalRevenue
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted successfully');
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteShop = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shop?')) return;

    try {
      await api.delete(`/shops/${id}`);
      toast.success('Shop deleted successfully');
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete shop');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      await api.delete(`/vehicles/${id}`);
      toast.success('Vehicle deleted successfully');
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete vehicle');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/users/${userId}`, { isActive: !currentStatus });
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-luxury-black py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-display font-bold text-white mb-8">
          Admin Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-luxury-dark rounded-2xl p-6 border border-luxury-charcoal/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <FaUsers className="text-4xl text-luxury-gold" />
            </div>
          </div>

          <div className="bg-luxury-dark rounded-2xl p-6 border border-luxury-charcoal/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Shops</p>
                <p className="text-3xl font-bold text-white">{stats.totalShops}</p>
              </div>
              <FaStore className="text-4xl text-blue-500" />
            </div>
          </div>

          <div className="bg-luxury-dark rounded-2xl p-6 border border-luxury-charcoal/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Vehicles</p>
                <p className="text-3xl font-bold text-white">{stats.totalVehicles}</p>
              </div>
              <FaCar className="text-4xl text-green-500" />
            </div>
          </div>

          <div className="bg-luxury-dark rounded-2xl p-6 border border-luxury-charcoal/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
              </div>
              <FaCalendarCheck className="text-4xl text-purple-500" />
            </div>
          </div>

          <div className="bg-luxury-dark rounded-2xl p-6 border border-luxury-charcoal/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <FaMoneyBillWave className="text-4xl text-luxury-gold" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-full font-semibold transition ${
              activeTab === 'users'
                ? 'bg-gradient-gold text-luxury-black'
                : 'bg-luxury-dark text-gray-400 hover:text-white border border-luxury-charcoal/30'
            }`}
          >
            Users ({stats.totalUsers})
          </button>
          <button
            onClick={() => setActiveTab('shops')}
            className={`px-6 py-3 rounded-full font-semibold transition ${
              activeTab === 'shops'
                ? 'bg-gradient-gold text-luxury-black'
                : 'bg-luxury-dark text-gray-400 hover:text-white border border-luxury-charcoal/30'
            }`}
          >
            Shops ({stats.totalShops})
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-6 py-3 rounded-full font-semibold transition ${
              activeTab === 'vehicles'
                ? 'bg-gradient-gold text-luxury-black'
                : 'bg-luxury-dark text-gray-400 hover:text-white border border-luxury-charcoal/30'
            }`}
          >
            Vehicles ({stats.totalVehicles})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 rounded-full font-semibold transition ${
              activeTab === 'bookings'
                ? 'bg-gradient-gold text-luxury-black'
                : 'bg-luxury-dark text-gray-400 hover:text-white border border-luxury-charcoal/30'
            }`}
          >
            Bookings ({stats.totalBookings})
          </button>
        </div>

        {/* Content */}
        <div className="bg-luxury-dark rounded-2xl p-6 border border-luxury-charcoal/30">
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Manage Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-luxury-charcoal/30">
                      <th className="text-left text-gray-400 py-3">Name</th>
                      <th className="text-left text-gray-400 py-3">Email</th>
                      <th className="text-left text-gray-400 py-3">Phone</th>
                      <th className="text-left text-gray-400 py-3">Role</th>
                      <th className="text-left text-gray-400 py-3">Status</th>
                      <th className="text-right text-gray-400 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-luxury-charcoal/20">
                        <td className="py-4 text-white">{user.name}</td>
                        <td className="py-4 text-gray-400">{user.email}</td>
                        <td className="py-4 text-gray-400">{user.phone}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                            user.role === 'shop_owner' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            user.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                            className="text-yellow-500 hover:text-yellow-400 mr-3"
                            title={user.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {user.isActive ? <FaBan /> : <FaCheckCircle />}
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-500 hover:text-red-400"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'shops' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Manage Shops</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shops.map((shop) => (
                  <div key={shop._id} className="bg-luxury-black rounded-xl p-6 border border-luxury-charcoal/30">
                    <h3 className="text-xl font-bold text-white mb-2">{shop.name}</h3>
                    <p className="text-gray-400 mb-2">{shop.city}</p>
                    <p className="text-gray-400 text-sm mb-4">{shop.address}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-luxury-gold">
                        📞 {shop.phone}
                      </span>
                      <button
                        onClick={() => handleDeleteShop(shop._id)}
                        className="text-red-500 hover:text-red-400"
                        title="Delete Shop"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Manage Vehicles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <div key={vehicle._id} className="bg-luxury-black rounded-xl overflow-hidden border border-luxury-charcoal/30">
                    <img
                      src={getImageUrl(vehicle.images?.[0])}
                      alt={vehicle.name}
                      className="w-full h-48 object-cover"
                      onError={handleImageError}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-1">{vehicle.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{vehicle.brand}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-luxury-gold font-bold">
                          ₹{vehicle.dailyRentInINR || vehicle.pricing?.perDay || 0}/day
                        </span>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle._id)}
                          className="text-red-500 hover:text-red-400"
                          title="Delete Vehicle"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">All Bookings</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-luxury-charcoal/30">
                      <th className="text-left text-gray-400 py-3">Booking ID</th>
                      <th className="text-left text-gray-400 py-3">Customer</th>
                      <th className="text-left text-gray-400 py-3">Vehicle</th>
                      <th className="text-left text-gray-400 py-3">Dates</th>
                      <th className="text-left text-gray-400 py-3">Amount</th>
                      <th className="text-left text-gray-400 py-3">Status</th>
                      <th className="text-left text-gray-400 py-3">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="border-b border-luxury-charcoal/20">
                        <td className="py-4 text-gray-400 font-mono text-sm">
                          {booking._id.slice(-8)}
                        </td>
                        <td className="py-4 text-white">{booking.user?.name || 'N/A'}</td>
                        <td className="py-4 text-gray-400">{booking.vehicle?.name || 'N/A'}</td>
                        <td className="py-4 text-gray-400 text-sm">
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-luxury-gold font-bold">
                          ₹{booking.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            booking.status === 'ongoing' ? 'bg-blue-500/20 text-blue-400' :
                            booking.status === 'confirmed' ? 'bg-yellow-500/20 text-yellow-400' :
                            booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            booking.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {booking.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
