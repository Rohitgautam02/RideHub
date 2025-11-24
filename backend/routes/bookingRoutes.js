const express = require('express');
const {
  createBooking,
  getMyBookings,
  getShopBookings,
  getBooking,
  updateBookingStatus,
  recordOdometer,
  cancelBooking,
  getShopStats,
  getAllBookings
} = require('../controllers/bookingController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .post(protect, authorize('customer', 'admin'), createBooking);

router
  .route('/all')
  .get(protect, authorize('admin'), getAllBookings);

router
  .route('/my')
  .get(protect, authorize('customer', 'admin'), getMyBookings);

router
  .route('/shop')
  .get(protect, authorize('shop_owner', 'admin'), getShopBookings);

router
  .route('/shop/stats')
  .get(protect, authorize('shop_owner', 'admin'), getShopStats);

router
  .route('/:id')
  .get(protect, getBooking);

router
  .route('/:id/status')
  .put(protect, authorize('shop_owner', 'admin'), updateBookingStatus);

router
  .route('/:id/record-odo')
  .put(protect, authorize('shop_owner', 'admin'), recordOdometer);

router
  .route('/:id/cancel')
  .put(protect, authorize('customer', 'admin'), cancelBooking);

module.exports = router;
