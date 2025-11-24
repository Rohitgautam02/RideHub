const Vehicle = require('../models/Vehicle');
const Shop = require('../models/Shop');
const Booking = require('../models/Booking');
const fs = require('fs');
const path = require('path');

// @desc    Get all vehicles with filters
// @route   GET /api/vehicles
// @access  Public
exports.getVehicles = async (req, res) => {
  try {
    const {
      type,
      city,
      shopId,
      minPrice,
      maxPrice,
      category,
      transmission,
      fuelType,
      available
    } = req.query;

    let query = {};

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by transmission
    if (transmission) {
      query.transmission = transmission;
    }

    // Filter by fuel type
    if (fuelType) {
      query.fuelType = fuelType;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.dailyRentInINR = {};
      if (minPrice) query.dailyRentInINR.$gte = parseInt(minPrice);
      if (maxPrice) query.dailyRentInINR.$lte = parseInt(maxPrice);
    }

    // Filter by availability
    if (available !== undefined) {
      query.available = available === 'true';
    }

    // Filter by shop
    if (shopId) {
      query.shop = shopId;
    }

    let vehicles = await Vehicle.find(query)
      .populate({
        path: 'shop',
        select: 'name address city location phone'
      })
      .sort('-createdAt');

    // Filter by city if provided
    if (city) {
      vehicles = vehicles.filter(vehicle => 
        vehicle.shop.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Public
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate({
      path: 'shop',
      select: 'name address city location phone',
      populate: {
        path: 'owner',
        select: 'name phone'
      }
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new vehicle
// @route   POST /api/vehicles
// @access  Private (shop_owner)
exports.createVehicle = async (req, res) => {
  try {
    // Get shop for this owner
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Please create a shop first before adding vehicles'
      });
    }

    // Add shop to req.body
    req.body.shop = shop._id;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const vehicle = await Vehicle.create(req.body);

    res.status(201).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (shop_owner)
exports.updateVehicle = async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id).populate('shop');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Make sure user is vehicle owner
    // Allow admin to update orphaned vehicles (where shop was already deleted)
    if (vehicle.shop) {
      if (vehicle.shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to update this vehicle'
        });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this vehicle'
      });
    }

    // Handle images
    let finalImages = [];
    
    // Get existing images from request body (images user wants to keep)
    if (req.body.existingImages) {
      try {
        finalImages = JSON.parse(req.body.existingImages);
      } catch (e) {
        finalImages = req.body.existingImages;
      }
    }
    
    // Delete images that are being removed
    const oldImages = vehicle.images || [];
    const imagesToDelete = oldImages.filter(img => !finalImages.includes(img));
    
    imagesToDelete.forEach(imagePath => {
      try {
        const filename = imagePath.replace('/uploads/', '');
        const fullPath = path.join(__dirname, '..', 'uploads', filename);
        
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (error) {
        console.error(`Failed to delete image: ${imagePath}`, error);
        // Continue even if delete fails
      }
    });
    
    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      finalImages = [...finalImages, ...newImages];
    }
    
    // Update images in request body
    req.body.images = finalImages;
    
    // Parse features if it's a string
    if (req.body.features && typeof req.body.features === 'string') {
      try {
        req.body.features = JSON.parse(req.body.features);
      } catch (e) {
        // If not JSON, split by comma
        req.body.features = req.body.features.split(',').map(f => f.trim()).filter(f => f);
      }
    }

    // Remove existingImages from body as it's not part of the schema
    delete req.body.existingImages;

    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (shop_owner)
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('shop');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Make sure user is vehicle owner
    // Allow admin to delete orphaned vehicles (where shop was already deleted)
    if (vehicle.shop) {
      if (vehicle.shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to delete this vehicle'
        });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this vehicle'
      });
    }

    // Check if vehicle has active bookings
    const activeBookings = await Booking.countDocuments({
      vehicle: vehicle._id,
      status: { $in: ['confirmed', 'ongoing'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete vehicle with active bookings'
      });
    }

    // Delete associated image files from uploads folder
    if (vehicle.images && vehicle.images.length > 0) {
      vehicle.images.forEach(imagePath => {
        // Extract filename from path (e.g., /uploads/123.jpg -> 123.jpg)
        const filename = imagePath.replace('/uploads/', '');
        const fullPath = path.join(__dirname, '..', 'uploads', filename);
        
        // Delete file if it exists
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    // Delete all bookings associated with this vehicle
    await Booking.deleteMany({ vehicle: vehicle._id });

    // Delete the vehicle
    await vehicle.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Vehicle and associated data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get vehicles for my shop
// @route   GET /api/vehicles/shop/myvehicles
// @access  Private (shop_owner)
exports.getMyShopVehicles = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'No shop found for this user'
      });
    }

    const vehicles = await Vehicle.find({ shop: shop._id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check vehicle availability for date range
// @route   POST /api/vehicles/:id/check-availability
// @access  Public
exports.checkAvailability = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    if (!vehicle.available) {
      return res.status(200).json({
        success: true,
        available: false,
        message: 'Vehicle is currently unavailable'
      });
    }

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      vehicle: vehicle._id,
      status: { $in: ['confirmed', 'ongoing'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(200).json({
        success: true,
        available: false,
        message: 'Vehicle is already booked for these dates'
      });
    }

    res.status(200).json({
      success: true,
      available: true,
      message: 'Vehicle is available for booking'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
