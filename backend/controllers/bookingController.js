const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Shop = require('../models/Shop');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (customer)
exports.createBooking = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, rentalType, customerNotes } = req.body;

    // Get vehicle
    const vehicle = await Vehicle.findById(vehicleId).populate('shop');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    if (!vehicle.available) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is not available'
      });
    }

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      vehicle: vehicleId,
      status: { $in: ['confirmed', 'ongoing'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is already booked for these dates'
      });
    }

    // Calculate total days and amount
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    
    let totalAmount;
    let totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    let totalHours = 0;

    if (rentalType === 'hourly') {
      totalHours = Math.ceil(timeDiff / (1000 * 3600));
      if (!vehicle.hourlyRentInINR) {
        return res.status(400).json({
          success: false,
          message: 'Hourly rental not available for this vehicle'
        });
      }
      totalAmount = totalHours * vehicle.hourlyRentInINR;
    } else {
      totalAmount = totalDays * vehicle.dailyRentInINR;
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      vehicle: vehicleId,
      shop: vehicle.shop._id,
      startDate,
      endDate,
      rentalType: rentalType || 'daily',
      totalDays,
      totalHours,
      totalAmount,
      customerNotes: customerNotes || '',
      status: 'pending'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('vehicle')
      .populate('shop')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all bookings for logged in user
// @route   GET /api/bookings/my
// @access  Private (customer)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('vehicle')
      .populate('shop', 'name address city phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all bookings for shop owner
// @route   GET /api/bookings/shop
// @access  Private (shop_owner)
exports.getShopBookings = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'No shop found for this user'
      });
    }

    const { status } = req.query;
    let query = { shop: shop._id };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('vehicle', 'name brand type images')
      .populate('user', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vehicle')
      .populate('shop')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    const shop = await Shop.findOne({ owner: req.user.id });
    
    if (
      booking.user._id.toString() !== req.user.id &&
      (!shop || shop._id.toString() !== booking.shop._id.toString()) &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (shop_owner, admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    const shop = await Shop.findOne({ owner: req.user.id });
    
    if (
      (!shop || shop._id.toString() !== booking.shop.toString()) &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    booking.status = status;
    await booking.save();

    booking = await Booking.findById(booking._id)
      .populate('vehicle')
      .populate('shop')
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Record odometer reading for pickup/return
// @route   PUT /api/bookings/:id/record-odo
// @access  Private (shop_owner)
exports.recordOdometer = async (req, res) => {
  try {
    const { startOdoKm, endOdoKm } = req.body;

    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    const shop = await Shop.findOne({ owner: req.user.id });
    
    if (!shop || shop._id.toString() !== booking.shop.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // Update odometer readings
    if (startOdoKm !== undefined) {
      booking.startOdoKm = startOdoKm;
      booking.status = 'ongoing';
    }

    if (endOdoKm !== undefined) {
      if (!booking.startOdoKm) {
        return res.status(400).json({
          success: false,
          message: 'Start odometer reading must be recorded first'
        });
      }

      booking.endOdoKm = endOdoKm;
      booking.distanceTravelledKm = endOdoKm - booking.startOdoKm;
      booking.status = 'completed';

      // Update vehicle total distance
      const vehicle = await Vehicle.findById(booking.vehicle);
      vehicle.totalDistanceTraveledKm += booking.distanceTravelledKm;
      vehicle.odoReadingKm = endOdoKm;
      await vehicle.save();
    }

    await booking.save();

    booking = await Booking.findById(booking._id)
      .populate('vehicle')
      .populate('shop')
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (customer)
exports.cancelBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Can only cancel pending or confirmed bookings
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel booking with status: ${booking.status}`
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    booking = await Booking.findById(booking._id)
      .populate('vehicle')
      .populate('shop')
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get booking statistics for shop owner
// @route   GET /api/bookings/shop/stats
// @access  Private (shop_owner)
exports.getShopStats = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'No shop found for this user'
      });
    }

    // Total bookings
    const totalBookings = await Booking.countDocuments({ shop: shop._id });

    // Completed bookings
    const completedBookings = await Booking.countDocuments({
      shop: shop._id,
      status: 'completed'
    });

    // Active bookings
    const activeBookings = await Booking.countDocuments({
      shop: shop._id,
      status: { $in: ['confirmed', 'ongoing'] }
    });

    // Total revenue
    const revenueResult = await Booking.aggregate([
      {
        $match: {
          shop: shop._id,
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Total distance traveled across all vehicles
    const distanceResult = await Booking.aggregate([
      {
        $match: {
          shop: shop._id,
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalDistance: { $sum: '$distanceTravelledKm' }
        }
      }
    ]);

    const totalDistance = distanceResult.length > 0 ? distanceResult[0].totalDistance : 0;

    // Vehicles count
    const totalVehicles = await Vehicle.countDocuments({ shop: shop._id });
    const availableVehicles = await Vehicle.countDocuments({
      shop: shop._id,
      available: true
    });

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        activeBookings,
        completedBookings,
        totalRevenue,
        totalDistance,
        totalVehicles,
        availableVehicles
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/all
// @access  Private (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('vehicle', 'name brand images pricing')
      .populate('shop', 'name location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
