import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingService, paymentService } from '../../services/api.service';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';
import { 
  FaCalendar, FaClock, FaRupeeSign, FaMapMarkerAlt, 
  FaPhone, FaEnvelope, FaCar, FaCheckCircle, FaTimesCircle 
} from 'react-icons/fa';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    loadBookingDetails();
  }, [id]);

  const loadBookingDetails = async () => {
    try {
      const [bookingRes, paymentRes] = await Promise.all([
        bookingService.getBooking(id),
        paymentService.getPaymentByBooking(id).catch(() => ({ data: null }))
      ]);
      
      setBooking(bookingRes.data);
      setPayment(paymentRes.data);
    } catch (error) {
      toast.error('Failed to load booking details');
      navigate('/customer/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingService.cancelBooking(id);
      toast.success('Booking cancelled successfully');
      loadBookingDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handlePayment = async () => {
    try {
      const response = await paymentService.createPayment(id);
      toast.success('Payment initiated successfully');
      // Here you would integrate with actual payment gateway
      // For now, just reload the page
      loadBookingDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      ongoing: 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-gray-100 text-gray-800 border-gray-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Loading />;
  if (!booking) return null;

  return (
    <div className="min-h-screen bg-luxury-black py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">
              Booking Details
            </h1>
            <p className="text-gray-400">Booking ID: {booking._id}</p>
          </div>
          <Link
            to="/customer/dashboard"
            className="px-6 py-3 bg-luxury-charcoal text-white rounded-lg hover:bg-luxury-charcoal/80 transition"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Status */}
            <div className="bg-luxury-dark rounded-xl border border-luxury-charcoal/30 p-6">
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                Booking Status
              </h2>
              <div className="flex items-center space-x-4">
                <span className={`px-6 py-3 rounded-full font-semibold uppercase border-2 ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
                {booking.status === 'pending' && (
                  <button
                    onClick={handleCancelBooking}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-luxury-dark rounded-xl border border-luxury-charcoal/30 p-6">
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                Vehicle Information
              </h2>
              <div className="flex items-start space-x-6">
                {booking.vehicle?.images && booking.vehicle.images.length > 0 && (
                  // eslint-disable-next-line no-undef
                  <img
                    src={getImageUrl(booking.vehicle.images[0])}
                    alt={booking.vehicle?.name || 'Vehicle'}
                    className="w-48 h-32 object-cover rounded-lg"
                    onError={handleImageError} // eslint-disable-line no-undef
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {booking.vehicle?.name || 'Vehicle'}
                  </h3>
                  <p className="text-xl text-luxury-gold mb-2">{booking.vehicle?.brand || 'Brand'}</p>
                  <div className="grid grid-cols-2 gap-4 text-gray-300">
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="capitalize">{booking.vehicle?.type || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transmission</p>
                      <p className="capitalize">{booking.vehicle?.transmission || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fuel Type</p>
                      <p className="capitalize">{booking.vehicle?.fuelType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Seating</p>
                      <p>{booking.vehicle?.seatingCapacity || 'N/A'} Seats</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="bg-luxury-dark rounded-xl border border-luxury-charcoal/30 p-6">
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                Rental Period
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-luxury-black/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <FaCalendar className="text-luxury-gold" />
                    <h3 className="font-semibold text-white">Start Date</h3>
                  </div>
                  <p className="text-2xl font-bold text-luxury-gold">
                    {format(new Date(booking.startDate), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-gray-400">
                    {format(new Date(booking.startDate), 'hh:mm a')}
                  </p>
                </div>
                <div className="bg-luxury-black/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <FaCalendar className="text-luxury-gold" />
                    <h3 className="font-semibold text-white">End Date</h3>
                  </div>
                  <p className="text-2xl font-bold text-luxury-gold">
                    {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-gray-400">
                    {format(new Date(booking.endDate), 'hh:mm a')}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-luxury-black/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Rental Type</p>
                  <p className="text-lg font-semibold text-white capitalize">
                    {booking.rentalType}
                  </p>
                </div>
                <div className="bg-luxury-black/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Duration</p>
                  <p className="text-lg font-semibold text-white">
                    {booking.rentalType === 'hourly' 
                      ? `${booking.totalHours} Hours` 
                      : `${booking.totalDays} Days`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Shop Information */}
            <div className="bg-luxury-dark rounded-xl border border-luxury-charcoal/30 p-6">
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                Shop Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FaCar className="text-luxury-gold" />
                  <div>
                    <p className="text-sm text-gray-500">Shop Name</p>
                    <p className="text-lg font-semibold text-white">{booking.shop?.name || 'Shop'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-luxury-gold" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-white">{booking.shop?.city || booking.shop?.address || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-luxury-gold" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="text-white">{booking.shop?.phone || booking.shop?.contactNumber || 'N/A'}</p>
                  </div>
                </div>
                {booking.shop.email && (
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-luxury-gold" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-white">{booking.shop.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Odometer Readings */}
            {(booking.startOdoKm || booking.endOdoKm) && (
              <div className="bg-luxury-dark rounded-xl border border-luxury-charcoal/30 p-6">
                <h2 className="text-2xl font-display font-bold text-white mb-4">
                  Odometer Readings
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {booking.startOdoKm && (
                    <div className="bg-luxury-black/50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Start Reading</p>
                      <p className="text-2xl font-bold text-white">
                        {booking.startOdoKm.toLocaleString()} km
                      </p>
                    </div>
                  )}
                  {booking.endOdoKm && (
                    <div className="bg-luxury-black/50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">End Reading</p>
                      <p className="text-2xl font-bold text-white">
                        {booking.endOdoKm.toLocaleString()} km
                      </p>
                    </div>
                  )}
                </div>
                {booking.startOdoKm && booking.endOdoKm && (
                  <div className="mt-4 bg-luxury-gold/10 border border-luxury-gold/30 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Total Distance Traveled</p>
                    <p className="text-2xl font-bold text-luxury-gold">
                      {(booking.endOdoKm - booking.startOdoKm).toLocaleString()} km
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-luxury-dark rounded-xl border border-luxury-charcoal/30 p-6">
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                Payment Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-luxury-charcoal/30">
                  <span className="text-gray-400">Base Amount</span>
                  <span className="text-white font-semibold">
                    ₹{booking.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-luxury-charcoal/30">
                  <span className="text-gray-400">Rate</span>
                  <span className="text-white">
                    ₹{booking.rentalType === 'hourly' 
                      ? `${(booking.totalAmount / booking.totalHours).toFixed(0)}/hr` 
                      : `${(booking.totalAmount / booking.totalDays).toFixed(0)}/day`
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="text-xl font-bold text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-luxury-gold">
                    ₹{booking.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Status */}
              {payment && (
                <div className="mt-6 pt-6 border-t border-luxury-charcoal/30">
                  <h3 className="font-semibold text-white mb-3">Payment Status</h3>
                  <span className={`px-4 py-2 rounded-full font-semibold uppercase text-sm ${getPaymentStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                  {payment.status === 'completed' && payment.paidAt && (
                    <p className="text-sm text-gray-400 mt-2">
                      Paid on {format(new Date(payment.paidAt), 'MMM dd, yyyy')}
                    </p>
                  )}
                </div>
              )}

              {/* Payment Action */}
              {booking.status === 'confirmed' && (!payment || payment.status === 'pending') && (
                <button
                  onClick={handlePayment}
                  className="w-full mt-6 bg-gradient-gold text-luxury-black font-semibold py-3 rounded-lg hover:opacity-90 transition"
                >
                  Proceed to Payment
                </button>
              )}
            </div>

            {/* Customer Notes */}
            {booking.customerNotes && (
              <div className="bg-luxury-dark rounded-xl border border-luxury-charcoal/30 p-6">
                <h2 className="text-xl font-display font-bold text-white mb-3">
                  Your Notes
                </h2>
                <p className="text-gray-300">{booking.customerNotes}</p>
              </div>
            )}

            {/* Status Timeline */}
            <div className="bg-luxury-dark rounded-xl border border-luxury-charcoal/30 p-6">
              <h2 className="text-xl font-display font-bold text-white mb-4">
                Booking Timeline
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <FaCheckCircle className={`text-lg ${booking.status !== 'cancelled' ? 'text-green-500' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Booking Created</p>
                    <p className="text-sm text-gray-400">
                      {format(new Date(booking.createdAt), 'MMM dd, yyyy hh:mm a')}
                    </p>
                  </div>
                </div>
                {booking.status === 'confirmed' && (
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <FaCheckCircle className="text-lg text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Confirmed</p>
                      <p className="text-sm text-gray-400">Ready for pickup</p>
                    </div>
                  </div>
                )}
                {booking.status === 'ongoing' && (
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <FaCheckCircle className="text-lg text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">In Progress</p>
                      <p className="text-sm text-gray-400">Vehicle currently rented</p>
                    </div>
                  </div>
                )}
                {booking.status === 'completed' && (
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <FaCheckCircle className="text-lg text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Completed</p>
                      <p className="text-sm text-gray-400">Rental finished successfully</p>
                    </div>
                  </div>
                )}
                {booking.status === 'cancelled' && (
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <FaTimesCircle className="text-lg text-red-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Cancelled</p>
                      <p className="text-sm text-gray-400">Booking was cancelled</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
