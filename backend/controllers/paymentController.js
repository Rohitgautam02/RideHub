const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret'
});

// @desc    Create payment intent (Stripe or Mock)
// @route   POST /api/payments/create
// @access  Private (customer)
exports.createPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Get booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to pay for this booking'
      });
    }

    // Check if already paid
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already paid'
      });
    }

    const paymentMode = process.env.PAYMENT_MODE || 'razorpay';

    if (paymentMode === 'razorpay') {
      // Create Razorpay order
      const options = {
        amount: Math.round(booking.totalAmount * 100), // Amount in paise
        currency: 'INR',
        receipt: `receipt_${bookingId}`,
        notes: {
          bookingId: bookingId,
          userId: req.user.id
        }
      };

      const order = await razorpay.orders.create(options);

      // Create payment record
      const payment = await Payment.create({
        booking: bookingId,
        user: req.user.id,
        amount: booking.totalAmount,
        method: 'razorpay',
        transactionId: order.id,
        status: 'pending'
      });

      res.status(200).json({
        success: true,
        data: {
          payment,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: process.env.RAZORPAY_KEY_ID
        }
      });
    } else {
      // Mock payment - auto success
      const payment = await Payment.create({
        booking: bookingId,
        user: req.user.id,
        amount: booking.totalAmount,
        method: 'mock',
        transactionId: `MOCK_${Date.now()}`,
        status: 'success'
      });

      // Update booking payment status
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      await booking.save();

      res.status(200).json({
        success: true,
        message: 'Mock payment successful',
        data: payment
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details'
      });
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Find and update payment
    const payment = await Payment.findOne({ transactionId: razorpay_order_id });
    if (payment) {
      payment.status = 'success';
      payment.transactionId = razorpay_payment_id;
      await payment.save();
    }

    // Update booking
    const booking = await Booking.findById(bookingId || payment.booking);
    if (booking) {
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      await booking.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: { payment, booking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check authorization
    if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all payments for user
// @route   GET /api/payments/my
// @access  Private (customer)
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate({
        path: 'booking',
        populate: {
          path: 'vehicle',
          select: 'name brand type'
        }
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get payment by booking
// @route   GET /api/payments/booking/:bookingId
// @access  Private
exports.getPaymentByBooking = async (req, res) => {
  try {
    const payment = await Payment.findOne({ booking: req.params.bookingId })
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found for this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
