import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import Loading from '../../components/Loading';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState('mock');

  useEffect(() => {
    if (!booking) {
      toast.error('No booking information found');
      navigate('/customer/bookings');
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [booking, navigate]);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create payment order
      const response = await api.post('/payments/create', {
        bookingId: booking._id
      });

      const { orderId, amount, currency, keyId, payment } = response.data.data;

      if (paymentMode === 'mock' || !orderId) {
        // Mock payment - direct success
        toast.success('Payment successful!');
        setTimeout(() => {
          navigate('/customer/bookings');
        }, 2000);
        return;
      }

      // Razorpay payment
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'RideHub',
        description: `Booking for ${booking.vehicle?.name || 'Vehicle'}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id
            });

            if (verifyResponse.data.success) {
              toast.success('Payment successful!');
              navigate('/customer/bookings');
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Payment verification failed');
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: booking.user?.name || '',
          email: booking.user?.email || '',
          contact: booking.user?.phone || ''
        },
        theme: {
          color: '#D4AF37'
        },
        modal: {
          ondismiss: function () {
            toast.info('Payment cancelled');
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);

    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
    }
  };

  if (!booking) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-luxury-black pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-luxury-dark rounded-2xl p-8 border border-luxury-charcoal/30">
          <h1 className="text-3xl font-bold text-white mb-6">Complete Payment</h1>

          {/* Booking Summary */}
          <div className="mb-8 p-6 bg-luxury-black rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Booking Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-300">
                <span>Vehicle:</span>
                <span className="font-semibold text-white">{booking.vehicle?.name}</span>
              </div>
              
              <div className="flex justify-between text-gray-300">
                <span>Brand:</span>
                <span className="font-semibold text-white">{booking.vehicle?.brand}</span>
              </div>
              
              <div className="flex justify-between text-gray-300">
                <span>Start Date:</span>
                <span className="font-semibold text-white">
                  {new Date(booking.startDate).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex justify-between text-gray-300">
                <span>End Date:</span>
                <span className="font-semibold text-white">
                  {new Date(booking.endDate).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex justify-between text-gray-300">
                <span>Duration:</span>
                <span className="font-semibold text-white">
                  {Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
              
              <div className="border-t border-gray-700 pt-3 mt-3">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-white">Total Amount:</span>
                  <span className="font-bold text-luxury-gold text-2xl">
                    ₹{booking.totalAmount || booking.totalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {booking.paymentStatus === 'paid' ? (
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-green-500 text-2xl" />
                <div>
                  <h3 className="text-green-400 font-semibold text-lg">Payment Completed</h3>
                  <p className="text-gray-400 text-sm">This booking has already been paid</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <FaTimesCircle className="text-yellow-500 text-2xl" />
                <div>
                  <h3 className="text-yellow-400 font-semibold text-lg">Payment Pending</h3>
                  <p className="text-gray-400 text-sm">Complete payment to confirm your booking</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Button */}
          {booking.paymentStatus !== 'paid' && (
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-gradient-gold text-luxury-black font-bold py-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Pay ₹${booking.totalAmount || booking.totalPrice}`}
            </button>
          )}

          {/* Back Button */}
          <button
            onClick={() => navigate('/customer/bookings')}
            className="w-full mt-4 border-2 border-luxury-gold text-luxury-gold font-semibold py-3 rounded-xl hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
