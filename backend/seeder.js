const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Shop = require('./models/Shop');
const Vehicle = require('./models/Vehicle');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@ridehub.com',
    phone: '9876543210',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@shop.com',
    phone: '9876543211',
    password: 'shop123',
    role: 'shop_owner'
  },
  {
    name: 'Priya Sharma',
    email: 'priya@shop.com',
    phone: '9876543212',
    password: 'shop123',
    role: 'shop_owner'
  },
  {
    name: 'Amit Patel',
    email: 'amit@shop.com',
    phone: '9876543213',
    password: 'shop123',
    role: 'shop_owner'
  },
  {
    name: 'John Customer',
    email: 'john@customer.com',
    phone: '9876543214',
    password: 'customer123',
    role: 'customer'
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah@customer.com',
    phone: '9876543215',
    password: 'customer123',
    role: 'customer'
  }
];

const getShopsData = (userIds) => [
  {
    owner: userIds[1], // Rajesh Kumar
    name: 'Mumbai Wheels Hub',
    address: 'Shop 12, Andheri West',
    city: 'Mumbai',
    pincode: '400053',
    location: {
      type: 'Point',
      coordinates: [72.8347, 19.1136] // Mumbai coordinates
    },
    phone: '9876543211'
  },
  {
    owner: userIds[2], // Priya Sharma
    name: 'Delhi Ride Center',
    address: 'Connaught Place, Block A',
    city: 'Delhi',
    pincode: '110001',
    location: {
      type: 'Point',
      coordinates: [77.2167, 28.6358] // Delhi coordinates
    },
    phone: '9876543212'
  },
  {
    owner: userIds[3], // Amit Patel
    name: 'Bangalore Riders Paradise',
    address: 'MG Road, Near Metro Station',
    city: 'Bangalore',
    pincode: '560001',
    location: {
      type: 'Point',
      coordinates: [77.6033, 12.9762] // Bangalore coordinates
    },
    phone: '9876543213'
  }
];

const getVehiclesData = (shopIds) => [
  // Mumbai Wheels Hub - Scooters
  {
    shop: shopIds[0],
    name: 'Activa 6G',
    brand: 'Honda',
    type: 'scooter',
    engineCapacityCc: 110,
    transmission: 'automatic',
    fuelType: 'petrol',
    dailyRentInINR: 500,
    hourlyRentInINR: 100,
    images: [
      'https://imgd.aeplcdn.com/1056x594/n/cw/ec/44686/activa-6g-right-side-view-2.png?isig=0&q=80&wm=3',
      'https://imgd.aeplcdn.com/1056x594/n/cw/ec/44686/activa-6g-front-view.jpeg?q=80&wm=3'
    ],
    seatingCapacity: 2,
    odoReadingKm: 5000,
    totalDistanceTraveledKm: 5000,
    available: true,
    features: ['Fuel efficient', 'Comfortable seat', 'LED headlamps']
  },
  {
    shop: shopIds[0],
    name: 'Jupiter 125',
    brand: 'TVS',
    type: 'scooter',
    engineCapacityCc: 125,
    transmission: 'automatic',
    fuelType: 'petrol',
    dailyRentInINR: 450,
    hourlyRentInINR: 100,
    images: [
      'https://placehold.co/800x500/png?text=TVS+Jupiter+125+-+Front',
      'https://placehold.co/800x500/png?text=TVS+Jupiter+125+-+Side'
    ],
    seatingCapacity: 2,
    odoReadingKm: 3500,
    totalDistanceTraveledKm: 3500,
    available: true,
    features: ['Large storage', 'Smooth ride', 'Mobile charging']
  },
  {
    shop: shopIds[0],
    name: 'Access 125',
    brand: 'Suzuki',
    type: 'scooter',
    engineCapacityCc: 125,
    transmission: 'automatic',
    fuelType: 'petrol',
    dailyRentInINR: 480,
    hourlyRentInINR: 100,
    images: [
      'https://placehold.co/800x500/png?text=Suzuki+Access+125+-+Front',
      'https://placehold.co/800x500/png?text=Suzuki+Access+125+-+Side'
    ],
    seatingCapacity: 2,
    odoReadingKm: 4200,
    totalDistanceTraveledKm: 4200,
    available: true,
    features: ['Bluetooth connectivity', 'Digital console']
  },

  // Mumbai Wheels Hub - Bikes
  {
    shop: shopIds[0],
    name: 'Pulsar 150',
    brand: 'Bajaj',
    type: 'bike',
    engineCapacityCc: 149,
    category: 'under_300cc',
    transmission: 'manual',
    fuelType: 'petrol',
    dailyRentInINR: 800,
    hourlyRentInINR: 120,
    images: [
      'https://placehold.co/800x500/png?text=Bajaj+Pulsar+150+-+Front',
      'https://placehold.co/800x500/png?text=Bajaj+Pulsar+150+-+Side'
    ],
    seatingCapacity: 2,
    odoReadingKm: 8000,
    totalDistanceTraveledKm: 8000,
    available: true,
    features: ['Sporty design', 'Good mileage', 'Comfortable ride']
  },
  {
    shop: shopIds[0],
    name: 'FZS V3',
    brand: 'Yamaha',
    type: 'bike',
    engineCapacityCc: 149,
    category: 'under_300cc',
    transmission: 'manual',
    fuelType: 'petrol',
    dailyRentInINR: 850,
    hourlyRentInINR: 130,
    images: [
      'https://placehold.co/800x500/png?text=Yamaha+FZS+V3+-+Front',
      'https://placehold.co/800x500/png?text=Yamaha+FZS+V3+-+Side'
    ],
    seatingCapacity: 2,
    odoReadingKm: 6500,
    totalDistanceTraveledKm: 6500,
    available: true,
    features: ['ABS', 'LED lights', 'Bluetooth enabled']
  },
  {
    shop: shopIds[0],
    name: 'Classic 350',
    brand: 'Royal Enfield',
    type: 'bike',
    engineCapacityCc: 349,
    category: '300_to_450cc',
    transmission: 'manual',
    fuelType: 'petrol',
    dailyRentInINR: 1500,
    hourlyRentInINR: 220,
    images: [
      'https://placehold.co/800x500/png?text=RE+Classic+350+-+Front',
      'https://placehold.co/800x500/png?text=RE+Classic+350+-+Side'
    ],
    seatingCapacity: 2,
    odoReadingKm: 12000,
    totalDistanceTraveledKm: 12000,
    available: true,
    features: ['Classic styling', 'Powerful engine', 'Comfortable for long rides']
  },

  // Mumbai Wheels Hub - Cars
  {
    shop: shopIds[0],
    name: 'Swift VXI',
    brand: 'Maruti Suzuki',
    type: 'car',
    engineCapacityCc: 1197,
    transmission: 'manual',
    fuelType: 'petrol',
    dailyRentInINR: 1800,
    hourlyRentInINR: 250,
    images: [
      'https://placehold.co/800x500/png?text=Maruti+Swift+VXI+-+Front',
      'https://placehold.co/800x500/png?text=Maruti+Swift+VXI+-+Rear'
    ],
    seatingCapacity: 5,
    odoReadingKm: 25000,
    totalDistanceTraveledKm: 25000,
    available: true,
    features: ['AC', 'Music system', 'Power steering', 'Airbags']
  },
  {
    shop: shopIds[0],
    name: 'i20 Sportz',
    brand: 'Hyundai',
    type: 'car',
    engineCapacityCc: 1197,
    transmission: 'manual',
    fuelType: 'petrol',
    dailyRentInINR: 2000,
    hourlyRentInINR: 280,
    images: [
      'https://placehold.co/800x500/png?text=Hyundai+i20+Sportz+-+Front',
      'https://placehold.co/800x500/png?text=Hyundai+i20+Sportz+-+Rear'
    ],
    seatingCapacity: 5,
    odoReadingKm: 18000,
    totalDistanceTraveledKm: 18000,
    available: true,
    features: ['Touchscreen', 'Reverse camera', 'Automatic climate control']
  },

  // Delhi Ride Center - Vehicles
  {
    shop: shopIds[1],
    name: 'Maestro Edge 125',
    brand: 'Hero',
    type: 'scooter',
    engineCapacityCc: 125,
    transmission: 'automatic',
    fuelType: 'petrol',
    dailyRentInINR: 430,
    hourlyRentInINR: 65,
    images: [
      'https://placehold.co/800x500/png?text=Hero+Maestro+Edge+125+-+Front',
      'https://placehold.co/800x500/png?text=Hero+Maestro+Edge+125+-+Side'
    ],
    seatingCapacity: 2,
    odoReadingKm: 2800,
    totalDistanceTraveledKm: 2800,
    available: true,
    features: ['i3S technology', 'External fuel filler', 'USB charger']
  },
  {
    shop: shopIds[1],
    name: 'Hornet 2.0',
    brand: 'Honda',
    type: 'bike',
    engineCapacityCc: 184,
    category: 'under_300cc',
    transmission: 'manual',
    fuelType: 'petrol',
    dailyRentInINR: 900,
    hourlyRentInINR: 135,
    images: [
      'https://placehold.co/800x500/png?text=Honda+Hornet+2.0+-+Front',
      'https://placehold.co/800x500/png?text=Honda+Hornet+2.0+-+Side'
    ],
    seatingCapacity: 2,
    odoReadingKm: 5500,
    totalDistanceTraveledKm: 5500,
    available: true,
    features: ['LED headlamp', 'Digital console', 'Single-channel ABS']
  },
  {
    shop: shopIds[1],
    name: 'Hunter 350',
    brand: 'Royal Enfield',
    type: 'bike',
    engineCapacityCc: 349,
    category: '300_to_450cc',
    transmission: 'manual',
    fuelType: 'petrol',
    dailyRentInINR: 1400,
    hourlyRentInINR: 210,
    images: [
      'https://placehold.co/800x500/png?text=RE+Hunter+350+-+Front',
      'https://placehold.co/800x500/png?text=RE+Hunter+350+-+Side'
    ],
    seatingCapacity: 2,
    odoReadingKm: 8500,
    totalDistanceTraveledKm: 8500,
    available: true,
    features: ['Roadster styling', 'Tripper navigation', 'Comfortable ergonomics']
  },
  {
    shop: shopIds[1],
    name: 'Innova Crysta',
    brand: 'Toyota',
    type: 'car',
    engineCapacityCc: 2393,
    transmission: 'manual',
    fuelType: 'diesel',
    dailyRentInINR: 3000,
    hourlyRentInINR: 420,
    images: [
      'https://placehold.co/800x500/png?text=Toyota+Innova+Crysta+-+Front',
      'https://placehold.co/800x500/png?text=Toyota+Innova+Crysta+-+Rear'
    ],
    seatingCapacity: 7,
    odoReadingKm: 35000,
    totalDistanceTraveledKm: 35000,
    available: true,
    features: ['7 seater', 'Diesel engine', 'Spacious', 'Touchscreen infotainment']
  },

  // Bangalore Riders Paradise - Vehicles
  {
    shop: shopIds[2],
    name: 'Activa 6G',
    brand: 'Honda',
    type: 'scooter',
    engineCapacityCc: 110,
    transmission: 'automatic',
    fuelType: 'petrol',
    dailyRentInINR: 500,
    hourlyRentInINR: 75,
    images: [
      'https://placehold.co/800x500/png?text=Honda+Activa+6G+-+Front',
      'https://placehold.co/800x500/png?text=Honda+Activa+6G+-+Side'
    ],
    seatingCapacity: 2,
    odoReadingKm: 4500,
    totalDistanceTraveledKm: 4500,
    available: true,
    features: ['Fuel efficient', 'Comfortable', 'LED headlamps']
  },
  {
    shop: shopIds[2],
    name: 'Duke 390',
    brand: 'KTM',
    type: 'bike',
    engineCapacityCc: 373,
    category: '300_to_450cc',
    transmission: 'manual',
    fuelType: 'petrol',
    dailyRentInINR: 2000,
    hourlyRentInINR: 290,
    images: [
      'https://placehold.co/800x500/png?text=KTM+Duke+390+-+Front',
      'https://placehold.co/800x500/png?text=KTM+Duke+390+-+Side'
    ],
    seatingCapacity: 2,
    odoReadingKm: 9500,
    totalDistanceTraveledKm: 9500,
    available: true,
    features: ['High performance', 'TFT display', 'Dual-channel ABS', 'Quickshifter']
  },
  {
    shop: shopIds[2],
    name: 'Swift Dzire',
    brand: 'Maruti Suzuki',
    type: 'car',
    engineCapacityCc: 1197,
    transmission: 'automatic',
    fuelType: 'petrol',
    dailyRentInINR: 1900,
    hourlyRentInINR: 270,
    images: [
      'https://placehold.co/800x500/png?text=Maruti+Swift+Dzire+-+Front',
      'https://placehold.co/800x500/png?text=Maruti+Swift+Dzire+-+Rear'
    ],
    seatingCapacity: 5,
    odoReadingKm: 22000,
    totalDistanceTraveledKm: 22000,
    available: true,
    features: ['Automatic transmission', 'Touchscreen', 'Rear parking sensors']
  }
];


// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Shop.deleteMany();
    await Vehicle.deleteMany();
    await Booking.deleteMany();
    await Payment.deleteMany();

    console.log('Data Destroyed...'.red.inverse);

    // Create users
    const createdUsers = await User.create(users);
    console.log('Users Created...'.green.inverse);

    // Get user IDs
    const userIds = createdUsers.map(user => user._id);

    // Create shops
    const shopsData = getShopsData(userIds);
    const createdShops = await Shop.create(shopsData);
    console.log('Shops Created...'.green.inverse);

    // Get shop IDs
    const shopIds = createdShops.map(shop => shop._id);

    // Create vehicles
    const vehiclesData = getVehiclesData(shopIds);
    const createdVehicles = await Vehicle.create(vehiclesData);
    console.log('Vehicles Created...'.green.inverse);

    console.log('Data Imported Successfully!'.green.inverse);
    console.log('');
    console.log('Login Credentials:'.cyan.bold);
    console.log('Admin: admin@ridehub.com / admin123'.yellow);
    console.log('Shop Owner 1: rajesh@shop.com / shop123'.yellow);
    console.log('Shop Owner 2: priya@shop.com / shop123'.yellow);
    console.log('Shop Owner 3: amit@shop.com / shop123'.yellow);
    console.log('Customer 1: john@customer.com / customer123'.yellow);
    console.log('Customer 2: sarah@customer.com / customer123'.yellow);

    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Shop.deleteMany();
    await Vehicle.deleteMany();
    await Booking.deleteMany();
    await Payment.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
