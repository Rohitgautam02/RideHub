import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/api.service';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';
import { FaCalendar, FaCar, FaUser, FaRupeeSign, FaEdit } from 'react-icons/fa';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showOdoModal, setShowOdoModal] = useState(false);
  const [odoReading, setOdoReading] = useState({ startOdoKm: '', endOdoKm: '' });

  useEffect(() => {
    loadBookings();
  }, [filterStatus]);

  const loadBookings = async () => {
    try {
      const status = filterStatus === 'all' ? null : filterStatus;
      const response = await bookingService.getShopBookings(status);
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking ${newStatus} successfully`);
      loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update booking status');
    }
  };

  const handleOdometerRecord = async (e) => {
    e.preventDefault();
    try {
      await bookingService.recordOdometer(selectedBooking._id, odoReading);
      toast.success('Odometer reading recorded successfully');
      setShowOdoModal(false);
      setOdoReading({ startOdoKm: '', endOdoKm: '' });
      loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record odometer');
    }
  };

  const openOdoModal = (booking) => {
    setSelectedBooking(booking);
    setOdoReading({
      startOdoKm: booking.startOdoKm || '',
      endOdoKm: booking.endOdoKm || ''
    });
    setShowOdoModal(true);
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

  return (
    <div className="min-h-screen bg-luxury-black py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-display font-bold text-white mb-8">
          Manage Bookings
        </h1>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'pending', 'confirmed', 'ongoing', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-2 rounded-lg font-semibold capitalize transition ${
                filterStatus === status
                  ? 'bg-gradient-gold text-luxury-black'
                  : 'bg-luxury-charcoal text-white hover:bg-luxury-charcoal/80'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-luxury-dark rounded-xl border border-luxury-charcoal/30 p-12 text-center">
            <p className="text-gray-400 text-lg">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-luxury-dark rounded-xl border border-luxury-charcoal/30 p-6 hover:border-luxury-gold/50 transition"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Booking Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start space-x-4">
                      {booking.vehicle?.images && booking.vehicle.images.length > 0 && (
                        // eslint-disable-next-line no-undef
                        <img
                          src={getImageUrl(booking.vehicle.images[0])}
                          alt={booking.vehicle?.name || 'Vehicle'}
                          className="w-32 h-24 object-cover rounded-lg"
                          onError={handleImageError} // eslint-disable-line no-undef
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {booking.vehicle?.name || 'Vehicle'}
                            </h3>
                            <p className="text-luxury-gold">{booking.vehicle?.brand || 'Brand'}</p>
                          </div>
                          <span className={`px-4 py-1 rounded-full text-sm font-semibold uppercase ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-gray-300">
                          <div className="flex items-center space-x-2">
                            <FaUser className="text-luxury-gold text-sm" />
                            <span>{booking.user?.name || 'Customer'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaCalendar className="text-luxury-gold text-sm" />
                            <span>
                              {format(new Date(booking.startDate), 'MMM dd')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaRupeeSign className="text-luxury-gold text-sm" />
                            <span className="font-semibold">₹{booking.totalAmount.toLocaleString()}</span>
                            <span className="text-sm text-gray-500">
                              ({booking.rentalType === 'hourly' ? `${booking.totalHours} hrs` : `${booking.totalDays} days`})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Contact */}
                  <div className="bg-luxury-black/50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Customer Contact</h4>
                    <div className="space-y-1 text-white">
                      <p className="text-sm">{booking.user?.email || 'N/A'}</p>
                      {booking.user?.phone && (
                        <p className="text-sm">{booking.user.phone}</p>
                      )}
                    </div>
                    {booking.startOdoKm && (
                      <div className="mt-3 pt-3 border-t border-luxury-charcoal/30">
                        <h4 className="text-xs font-semibold text-gray-400 mb-1">Odometer</h4>
                        <p className="text-sm text-white">
                          Start: {booking.startOdoKm.toLocaleString()} km
                        </p>
                        {booking.endOdoKm && (
                          <p className="text-sm text-white">
                            End: {booking.endOdoKm.toLocaleString()} km
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => {
                          openOdoModal(booking);
                          // Also update status to ongoing
                          handleStatusUpdate(booking._id, 'ongoing');
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                      >
                        Start Rental
                      </button>
                    )}
                    {booking.status === 'ongoing' && (
                      <>
                        <button
                          onClick={() => openOdoModal(booking)}
                          className="px-4 py-2 bg-luxury-gold text-luxury-black rounded-lg hover:opacity-90 transition text-sm font-semibold flex items-center justify-center space-x-2"
                        >
                          <FaEdit />
                          <span>Odometer</span>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'completed')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                        >
                          Complete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Customer Notes */}
                {booking.customerNotes && (
                  <div className="mt-4 pt-4 border-t border-luxury-charcoal/30">
                    <h4 className="text-sm font-semibold text-gray-400 mb-1">Customer Notes:</h4>
                    <p className="text-white">{booking.customerNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Odometer Modal */}
      {showOdoModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-luxury-dark rounded-xl border border-luxury-charcoal/30 p-8 max-w-md w-full">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              Record Odometer Reading
            </h2>
            <form onSubmit={handleOdometerRecord} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Start Odometer (km)
                </label>
                <input
                  type="number"
                  value={odoReading.startOdoKm}
                  onChange={(e) => setOdoReading({ ...odoReading, startOdoKm: e.target.value })}
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-charcoal rounded-lg text-white focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 outline-none"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  End Odometer (km) - Optional
                </label>
                <input
                  type="number"
                  value={odoReading.endOdoKm}
                  onChange={(e) => setOdoReading({ ...odoReading, endOdoKm: e.target.value })}
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-charcoal rounded-lg text-white focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 outline-none"
                  min="0"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-gold text-luxury-black font-semibold py-3 rounded-lg hover:opacity-90 transition"
                >
                  Save Reading
                </button>
                <button
                  type="button"
                  onClick={() => setShowOdoModal(false)}
                  className="flex-1 bg-luxury-charcoal text-white font-semibold py-3 rounded-lg hover:bg-luxury-charcoal/80 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
