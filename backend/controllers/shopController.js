const Shop = require('../models/Shop');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const fs = require('fs');
const path = require('path');

// @desc    Get all shops with optional filters
// @route   GET /api/shops
// @access  Public
exports.getShops = async (req, res) => {
  try {
    const { city, lat, lng, radiusKm } = req.query;
    
    let query = {};

    // Filter by city
    if (city) {
      query.city = new RegExp(city, 'i');
    }

    // Filter active shops
    query.isActive = true;

    let shops;

    // Nearby search using geospatial query
    if (lat && lng) {
      const radius = radiusKm || 10; // Default 10km
      const maxDistanceInMeters = radius * 1000;

      shops = await Shop.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            distanceField: 'distance',
            maxDistance: maxDistanceInMeters,
            spherical: true,
            query: query
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'owner',
            foreignField: '_id',
            as: 'ownerDetails'
          }
        },
        {
          $project: {
            name: 1,
            address: 1,
            city: 1,
            pincode: 1,
            location: 1,
            phone: 1,
            distance: 1,
            ownerDetails: { $arrayElemAt: ['$ownerDetails.name', 0] }
          }
        }
      ]);
    } else {
      shops = await Shop.find(query).populate('owner', 'name email phone');
    }

    res.status(200).json({
      success: true,
      count: shops.length,
      data: shops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single shop
// @route   GET /api/shops/:id
// @access  Public
exports.getShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('owner', 'name email phone');

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Get vehicles count
    const vehiclesCount = await Vehicle.countDocuments({ shop: shop._id });

    res.status(200).json({
      success: true,
      data: {
        ...shop.toObject(),
        vehiclesCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new shop
// @route   POST /api/shops
// @access  Private (shop_owner)
exports.createShop = async (req, res) => {
  try {
    // Check if owner already has a shop
    const existingShop = await Shop.findOne({ owner: req.user.id });
    
    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: 'You already have a shop registered'
      });
    }

    // Add user as owner
    req.body.owner = req.user.id;

    // Set location
    if (req.body.longitude && req.body.latitude) {
      req.body.location = {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
      };
    }

    const shop = await Shop.create(req.body);

    res.status(201).json({
      success: true,
      data: shop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update shop
// @route   PUT /api/shops/:id
// @access  Private (shop_owner)
exports.updateShop = async (req, res) => {
  try {
    let shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Make sure user is shop owner
    if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this shop'
      });
    }

    // Update location if coordinates provided
    if (req.body.longitude && req.body.latitude) {
      req.body.location = {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
      };
    }

    shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: shop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete shop
// @route   DELETE /api/shops/:id
// @access  Private (shop_owner, admin)
exports.deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Make sure user is shop owner or admin
    if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this shop'
      });
    }

    // Get all vehicles from this shop to delete their images
    const vehicles = await Vehicle.find({ shop: shop._id });
    
    // Delete image files for all vehicles
    vehicles.forEach(vehicle => {
      if (vehicle.images && vehicle.images.length > 0) {
        vehicle.images.forEach(imagePath => {
          const filename = imagePath.replace('/uploads/', '');
          const fullPath = path.join(__dirname, '..', 'uploads', filename);
          
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }
    });

    // Delete all bookings associated with this shop
    await Booking.deleteMany({ shop: shop._id });

    // Delete all vehicles associated with this shop
    await Vehicle.deleteMany({ shop: shop._id });

    // Delete the shop
    await shop.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Shop and all associated data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my shop (for shop owner)
// @route   GET /api/shops/me/myshop
// @access  Private (shop_owner)
exports.getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'No shop found for this user'
      });
    }

    // Get vehicles count
    const vehiclesCount = await Vehicle.countDocuments({ shop: shop._id });

    res.status(200).json({
      success: true,
      data: {
        ...shop.toObject(),
        vehiclesCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
