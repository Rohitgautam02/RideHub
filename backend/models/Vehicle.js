const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.ObjectId,
    ref: 'Shop',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a vehicle name'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
    trim: true
  },
  type: {
    type: String,
    enum: ['scooter', 'bike', 'car'],
    required: [true, 'Please specify vehicle type']
  },
  engineCapacityCc: {
    type: Number,
    required: [true, 'Please add engine capacity in CC']
  },
  category: {
    type: String,
    enum: ['under_300cc', '300_to_450cc', null],
    default: null
  },
  transmission: {
    type: String,
    enum: ['manual', 'automatic', 'semi-automatic'],
    required: true
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'cng'],
    required: true
  },
  dailyRentInINR: {
    type: Number,
    required: [true, 'Please add daily rent amount']
  },
  hourlyRentInINR: {
    type: Number,
    default: null
  },
  images: [{
    type: String
  }],
  seatingCapacity: {
    type: Number,
    required: [true, 'Please add seating capacity']
  },
  odoReadingKm: {
    type: Number,
    default: 0
  },
  totalDistanceTraveledKm: {
    type: Number,
    default: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Set category automatically based on engine capacity for bikes
VehicleSchema.pre('save', function(next) {
  if (this.type === 'bike') {
    if (this.engineCapacityCc < 300) {
      this.category = 'under_300cc';
    } else if (this.engineCapacityCc >= 300 && this.engineCapacityCc <= 450) {
      this.category = '300_to_450cc';
    }
  }
  next();
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
