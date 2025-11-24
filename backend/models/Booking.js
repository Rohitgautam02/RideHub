const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  vehicle: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  shop: {
    type: mongoose.Schema.ObjectId,
    ref: 'Shop',
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  rentalType: {
    type: String,
    enum: ['hourly', 'daily'],
    default: 'daily'
  },
  totalHours: {
    type: Number,
    default: 0
  },
  totalDays: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  startOdoKm: {
    type: Number,
    default: null
  },
  endOdoKm: {
    type: Number,
    default: null
  },
  distanceTravelledKm: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  customerNotes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate total days before saving
BookingSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    const timeDiff = this.endDate.getTime() - this.startDate.getTime();
    this.totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (this.rentalType === 'hourly') {
      this.totalHours = Math.ceil(timeDiff / (1000 * 3600));
    }
  }
  next();
});

// Calculate distance travelled when end odo is set
BookingSchema.pre('save', function(next) {
  if (this.startOdoKm && this.endOdoKm) {
    this.distanceTravelledKm = this.endOdoKm - this.startOdoKm;
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
