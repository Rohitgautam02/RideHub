import api from '../utils/api';

export const vehicleService = {
  // Get all vehicles with filters
  getVehicles: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    const response = await api.get(`/vehicles?${queryParams}`);
    return response.data;
  },

  // Get single vehicle
  getVehicle: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  // Check availability
  checkAvailability: async (id, dates) => {
    const response = await api.post(`/vehicles/${id}/check-availability`, dates);
    return response.data;
  },

  // Create vehicle (shop owner)
  createVehicle: async (formData) => {
    const response = await api.post('/vehicles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update vehicle (shop owner)
  updateVehicle: async (id, formData) => {
    const response = await api.put(`/vehicles/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete vehicle (shop owner)
  deleteVehicle: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },

  // Get my shop vehicles
  getMyShopVehicles: async () => {
    const response = await api.get('/vehicles/shop/myvehicles');
    return response.data;
  },

  // Aliases for consistency
  addVehicle: async (formData) => {
    return vehicleService.createVehicle(formData);
  },
};

export const shopService = {
  // Get all shops with filters
  getShops: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    const response = await api.get(`/shops?${queryParams}`);
    return response.data;
  },

  // Get single shop
  getShop: async (id) => {
    const response = await api.get(`/shops/${id}`);
    return response.data;
  },

  // Get my shop
  getMyShop: async () => {
    const response = await api.get('/shops/me/myshop');
    return response.data;
  },

  // Create shop
  createShop: async (shopData) => {
    const response = await api.post('/shops', shopData);
    return response.data;
  },

  // Update shop
  updateShop: async (id, shopData) => {
    const response = await api.put(`/shops/${id}`, shopData);
    return response.data;
  },
};

export const bookingService = {
  // Create booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get my bookings
  getMyBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  // Get shop bookings
  getShopBookings: async (status) => {
    const url = status ? `/bookings/shop?status=${status}` : '/bookings/shop';
    const response = await api.get(url);
    return response.data;
  },

  // Get single booking
  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  },

  // Record odometer
  recordOdometer: async (id, odometerData) => {
    const response = await api.put(`/bookings/${id}/record-odo`, odometerData);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  // Get shop stats
  getShopStats: async () => {
    const response = await api.get('/bookings/shop/stats');
    return response.data;
  },
};

export const paymentService = {
  // Create payment
  createPayment: async (bookingId) => {
    const response = await api.post('/payments/create', { bookingId });
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId) => {
    const response = await api.post('/payments/confirm', { paymentIntentId });
    return response.data;
  },

  // Get my payments
  getMyPayments: async () => {
    const response = await api.get('/payments/my');
    return response.data;
  },

  // Get payment by booking
  getPaymentByBooking: async (bookingId) => {
    const response = await api.get(`/payments/booking/${bookingId}`);
    return response.data;
  },
};
