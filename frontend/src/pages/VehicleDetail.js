import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService, bookingService } from '../services/api.service';
import { useAuth } from '../context/AuthContext';
import ImageCarousel from '../components/ImageCarousel';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaGasPump, FaCog, FaUsers, FaClock } from 'react-icons/fa';

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isCustomer } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    rentalType: 'daily',
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadVehicle();
  }, [id]);

  const loadVehicle = async () => {
    try {
      const response = await vehicleService.getVehicle(id);
      setVehicle(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load vehicle details');
      navigate('/vehicles');
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0;
    
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const timeDiff = end.getTime() - start.getTime();
    
    if (bookingData.rentalType === 'hourly') {
      const hours = Math.ceil(timeDiff / (1000 * 3600));
      return hours * (vehicle.hourlyRentInINR || 0);
    } else {
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return days * vehicle.dailyRentInINR;
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.info('Please login to book a vehicle');
      navigate('/login');
      return;
    }

    if (!isCustomer) {
      toast.error('Only customers can book vehicles');
      return;
    }

    setBookingLoading(true);

    try {
      // Check availability first
      const availabilityResponse = await vehicleService.checkAvailability(id, {
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
      });

      if (!availabilityResponse.available) {
        toast.error(availabilityResponse.message);
        setBookingLoading(false);
        return;
      }

      // Create booking
      const booking = await bookingService.createBooking({
        vehicleId: id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        rentalType: bookingData.rentalType,
      });

      toast.success('Booking created successfully!');
      // Navigate to payment page with booking details
      navigate('/customer/payment', { 
        state: { 
          booking: {
            ...booking.data,
            vehicle: vehicle
          }
        } 
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Vehicle not found</h2>
          <p className="text-gray-600 mb-4">The vehicle you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/vehicles')}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Browse Vehicles
          </button>
        </div>
      </div>
    );
  }
  if (!vehicle.shop) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Shop information unavailable</h2>
          <p className="text-gray-600 mb-4">This vehicle's shop details are not available.</p>
          <button
            onClick={() => navigate('/vehicles')}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Browse Vehicles
          </button>
        </div>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicle Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Image Carousel */}
              <div className="h-96">
                <ImageCarousel key={vehicle._id} images={vehicle.images} />
              </div>

              {/* Vehicle Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{vehicle.name}</h1>
                    <p className="text-xl text-gray-600">{vehicle.brand}</p>
                  </div>
                  <span className="bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-semibold uppercase">
                    {vehicle.type}
                  </span>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FaCog className="text-2xl text-primary-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Transmission</p>
                    <p className="font-semibold capitalize">{vehicle.transmission}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FaGasPump className="text-2xl text-primary-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Fuel Type</p>
                    <p className="font-semibold capitalize">{vehicle.fuelType}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FaUsers className="text-2xl text-primary-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Seating</p>
                    <p className="font-semibold">{vehicle.seatingCapacity} Seats</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FaClock className="text-2xl text-primary-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Engine CC</p>
                    <p className="font-semibold">{vehicle.engineCapacityCc} cc</p>
                  </div>
                </div>

                {/* Features */}
                {vehicle.features && vehicle.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-3">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm"
                        >
                          ✓ {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shop Info */}
                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold mb-3">Rental Shop</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg">{vehicle.shop?.name || 'Shop Name'}</h4>
                    <p className="text-gray-600 flex items-center mt-2">
                      <FaMapMarkerAlt className="mr-2" />
                      {vehicle.shop?.address || 'Address'}, {vehicle.shop?.city || 'City'} {vehicle.shop?.pincode ? `- ${vehicle.shop.pincode}` : ''}
                    </p>
                    {vehicle.shop?.phone && (
                      <p className="text-gray-600 mt-1">📞 {vehicle.shop.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-6">Book This Vehicle</h2>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Daily Rate:</span>
                  <span className="text-2xl font-bold text-primary-600">₹{vehicle.dailyRentInINR}</span>
                </div>
                {vehicle.hourlyRentInINR && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hourly Rate:</span>
                    <span className="text-xl font-semibold text-primary-600">₹{vehicle.hourlyRentInINR}</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleBooking} className="space-y-4">
                {/* Rental Type */}
                {vehicle.hourlyRentInINR && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rental Type
                    </label>
                    <select
                      value={bookingData.rentalType}
                      onChange={(e) => setBookingData({ ...bookingData, rentalType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="hourly">Hourly</option>
                    </select>
                  </div>
                )}

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingData.startDate}
                    onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                    required
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingData.endDate}
                    onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                    required
                    min={bookingData.startDate || new Date().toISOString().slice(0, 16)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Total Amount */}
                {total > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total Amount:</span>
                      <span className="text-primary-600">₹{total}</span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  type="submit"
                  disabled={bookingLoading || !vehicle.available}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? 'Processing...' : vehicle.available ? 'Book Now' : 'Not Available'}
                </button>
              </form>

              {!isAuthenticated && (
                <p className="text-sm text-gray-600 text-center mt-4">
                  Please <span className="text-primary-600 font-semibold cursor-pointer" onClick={() => navigate('/login')}>login</span> to book
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
