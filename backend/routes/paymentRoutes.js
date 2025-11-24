const express = require('express');
const {
  createPayment,
  verifyPayment,
  getPayment,
  getMyPayments,
  getPaymentByBooking
} = require('../controllers/paymentController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/create')
  .post(protect, authorize('customer', 'admin'), createPayment);

router
  .route('/verify')
  .post(protect, verifyPayment);

router
  .route('/my')
  .get(protect, authorize('customer', 'admin'), getMyPayments);

router
  .route('/booking/:bookingId')
  .get(protect, getPaymentByBooking);

router
  .route('/:id')
  .get(protect, getPayment);

module.exports = router;
