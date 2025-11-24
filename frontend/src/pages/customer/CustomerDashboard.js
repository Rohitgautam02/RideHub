import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService, paymentService } from '../../services/api.service';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';
import { FaCalendar, FaCreditCard, FaHistory } from 'react-icons/fa';

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingService.cancelBooking(id);
      toast.success('Booking cancelled successfully');
      loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      ongoing: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Loading />;

  const upcomingBookings = bookings.filter(b => ['pending', 'confirmed'].includes(b.status));
  const activeBookings = bookings.filter(b => b.status === 'ongoing');
  const pastBookings = bookings.filter(b => ['completed', 'cancelled'].includes(b.status));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 font-semibold mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-primary-600">{bookings.length}</p>
              </div>
              <FaHistory className="text-4xl text-primary-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 font-semibold mb-1">Active Bookings</p>
                <p className="text-3xl font-bold text-blue-600">{activeBookings.length}</p>
              </div>
              <FaCalendar className="text-4xl text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 font-semibold mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{pastBookings.filter(b => b.status === 'completed').length}</p>
              </div>
              <FaCreditCard className="text-4xl text-green-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'bookings'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'upcoming'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {(activeTab === 'bookings' ? bookings : upcomingBookings).length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-700 mb-6">Start exploring and book your first ride!</p>
              <Link
                to="/vehicles"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Browse Vehicles
              </Link>
            </div>
          ) : (
            (activeTab === 'bookings' ? bookings : upcomingBookings).map((booking) => (
              <div key={booking._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      {/* eslint-disable-next-line no-undef */}
                      <img
                        src={getImageUrl(booking.vehicle?.images?.[0])}
                        alt={booking.vehicle?.name || 'Vehicle'}
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={handleImageError} // eslint-disable-line no-undef
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{booking.vehicle?.name || 'Vehicle'}</h3>
                        <p className="text-gray-700">{booking.vehicle?.brand || 'Brand'}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getStatusColor(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 text-right">
                      <div className="text-2xl font-bold text-primary-600 mb-2">
                        ₹{booking.totalAmount}
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking.totalDays} {booking.totalDays === 1 ? 'day' : 'days'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                    <div>
                      <span className="font-semibold">Pickup:</span> {format(new Date(booking.startDate), 'dd MMM yyyy, hh:mm a')}
                    </div>
                    <div>
                      <span className="font-semibold">Return:</span> {format(new Date(booking.endDate), 'dd MMM yyyy, hh:mm a')}
                    </div>
                    <div>
                      <span className="font-semibold">Shop:</span> {booking.shop?.name || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold">Payment:</span>{' '}
                      <span className={booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                        {booking.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-4">
                    <Link
                      to={`/customer/bookings/${booking._id}`}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                      View Details
                    </Link>
                    
                    {booking.paymentStatus === 'pending' && (
                      <Link
                        to="/customer/payment"
                        state={{ booking }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Pay Now
                      </Link>
                    )}
                    
                    {['pending', 'confirmed'].includes(booking.status) && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
