# RideHub - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Features Implementation](#features-implementation)
4. [Database Schema](#database-schema)
5. [API Reference](#api-reference)
6. [Frontend Structure](#frontend-structure)
7. [Bug Fixes & Improvements](#bug-fixes--improvements)
8. [Deployment Guide](#deployment-guide)

---

## 1. Project Overview

**RideHub** is a comprehensive vehicle rental platform that connects customers with vehicle rental shops across India. Built with MERN stack and designed with a luxury theme featuring dark backgrounds and gold accents.

### Project Timeline
- Initial Setup & Core Features
- Image Upload & Camera Capture
- Cascade Deletion Implementation
- Navigation Refresh System
- Image Loading Fixes
- Login Validation Fix
- Payment Integration (Razorpay)
- Text Visibility Improvements

### Key Statistics
- **3 User Roles**: Customer, Shop Owner, Admin
- **15+ API Endpoints**
- **25+ React Components**
- **8 MongoDB Models**
- **Full CRUD Operations** for all entities

---

## 2. Technical Architecture

### Backend Architecture

```
backend/
├── controllers/          # Business logic
│   ├── authController.js       # Authentication
│   ├── vehicleController.js    # Vehicle CRUD
│   ├── bookingController.js    # Booking management
│   ├── shopController.js       # Shop operations
│   ├── userController.js       # User management
│   └── paymentController.js    # Payment processing
├── models/              # MongoDB schemas
│   ├── User.js          # User model (customer, shop_owner, admin)
│   ├── Vehicle.js       # Vehicle model
│   ├── Booking.js       # Booking model
│   ├── Shop.js          # Shop model
│   └── Payment.js       # Payment model
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── vehicleRoutes.js
│   ├── bookingRoutes.js
│   ├── shopRoutes.js
│   ├── userRoutes.js
│   └── paymentRoutes.js
├── middleware/          # Custom middleware
│   ├── auth.js          # JWT verification & role checking
│   └── upload.js        # Multer file upload
├── uploads/             # Uploaded vehicle images
├── seeder.js           # Database seeder
└── server.js           # Express app entry point
```

### Frontend Architecture

```
frontend/
├── public/
│   └── sample-vehicles/  # Sample vehicle images
└── src/
    ├── components/       # Reusable components
    │   ├── Navbar.js           # Navigation with user menu
    │   ├── Footer.js           # Footer component
    │   ├── Loading.js          # Loading spinner
    │   ├── PrivateRoute.js     # Protected route wrapper
    │   └── ImageCarousel.js    # Image gallery carousel
    ├── context/          # React Context
    │   └── AuthContext.js      # Authentication state
    ├── pages/            # Page components
    │   ├── Home.js                    # Landing page
    │   ├── Login.js                   # Login page
    │   ├── Register.js                # Registration page
    │   ├── VehicleList.js             # Browse vehicles
    │   ├── VehicleDetail.js           # Vehicle details & booking
    │   ├── SearchVehicles.js          # Search page
    │   ├── customer/
    │   │   ├── CustomerDashboard.js   # Customer dashboard
    │   │   ├── BookingDetail.js       # Booking details
    │   │   └── Payment.js             # Payment page
    │   ├── shop/
    │   │   ├── ShopOwnerDashboard.js  # Shop dashboard
    │   │   ├── AddVehicle.js          # Add vehicle form
    │   │   ├── EditVehicle.js         # Edit vehicle form
    │   │   └── ManageBookings.js      # Booking management
    │   └── admin/
    │       └── AdminDashboard.js      # Admin panel
    ├── services/         # API services
    │   └── api.service.js      # API calls using axios
    ├── utils/            # Utility functions
    │   ├── api.js              # Axios instance
    │   ├── validation.js       # Form validation
    │   └── imageUtils.js       # Image handling
    ├── App.js            # Main app component
    ├── index.js          # React entry point
    └── index.css         # Global styles (Tailwind)
```

---

## 3. Features Implementation

### 3.1 Authentication System

**Technology**: JWT (JSON Web Tokens)

**Implementation**:
- User registration with role selection (customer/shop_owner)
- Password hashing using bcrypt
- JWT token generation with 30-day expiry
- Token stored in localStorage
- Protected routes using AuthContext
- Role-based access control

**Files**:
- `backend/controllers/authController.js`
- `backend/middleware/auth.js`
- `frontend/src/context/AuthContext.js`
- `frontend/src/components/PrivateRoute.js`

### 3.2 Vehicle Management

**Features**:
- Multi-image upload (up to 5 images)
- Camera capture support for mobile devices
- Image preview before upload
- CRUD operations (Create, Read, Update, Delete)
- Automatic image cleanup on deletion
- Vehicle filtering and search

**Key Implementation**:
```javascript
// Camera Capture
<input
  type="file"
  accept="image/*"
  capture="environment"  // Enables camera
  multiple
/>

// Image Cleanup on Delete
vehicle.images.forEach(imagePath => {
  const filename = imagePath.replace('/uploads/', '');
  const fullPath = path.join(__dirname, '..', 'uploads', filename);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
});
```

**Files**:
- `backend/controllers/vehicleController.js`
- `frontend/src/pages/shop/AddVehicle.js`
- `frontend/src/pages/shop/EditVehicle.js`

### 3.3 Booking System

**Features**:
- Date range selection
- Availability checking
- Real-time status updates (pending → confirmed → ongoing → completed)
- Booking cancellation
- Payment integration
- Booking history

**Booking Flow**:
1. Customer selects vehicle and dates
2. System checks availability
3. Booking created with "pending" status
4. Redirect to payment page
5. Payment success → status changes to "confirmed"
6. Shop owner can mark as "ongoing" when vehicle picked up
7. Shop owner marks as "completed" when returned

**Files**:
- `backend/controllers/bookingController.js`
- `frontend/src/pages/VehicleDetail.js`
- `frontend/src/pages/customer/BookingDetail.js`

### 3.4 Payment Integration

**Technology**: Razorpay

**Features**:
- Payment order creation
- Razorpay checkout integration
- Payment verification with signature
- Mock payment mode for testing
- Payment status tracking

**Payment Flow**:
1. Create order: `POST /api/payments/create`
2. Open Razorpay checkout modal
3. User completes payment
4. Verify payment: `POST /api/payments/verify`
5. Update booking status to "confirmed"

**Configuration**:
```env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
PAYMENT_MODE=mock  # or "razorpay" for live
```

**Files**:
- `backend/controllers/paymentController.js`
- `frontend/src/pages/customer/Payment.js`

### 3.5 Search & Filters

**Filters Available**:
- Vehicle Type (scooter, bike, car)
- City/Location
- Price Range (min/max)
- Transmission (manual/automatic)
- Fuel Type (petrol/diesel/electric)

**Implementation**:
```javascript
// Backend filtering
let query = {};
if (type) query.type = type;
if (minPrice || maxPrice) {
  query.dailyRentInINR = {};
  if (minPrice) query.dailyRentInINR.$gte = minPrice;
  if (maxPrice) query.dailyRentInINR.$lte = maxPrice;
}
```

**Files**:
- `frontend/src/pages/VehicleList.js`
- `frontend/src/pages/SearchVehicles.js`

### 3.6 Cascade Deletion

**Purpose**: Maintain data integrity when deleting related entities

**Implementation**:

**When Shop is Deleted**:
1. Find all vehicles belonging to shop
2. Delete all vehicle images from filesystem
3. Delete all bookings for those vehicles
4. Delete all vehicles
5. Delete the shop

**When Vehicle is Deleted**:
1. Delete all vehicle images
2. Delete all bookings for the vehicle
3. Delete the vehicle

**When User is Deleted**:
- If shop_owner: Delete shop → triggers cascade
- If customer: Delete all bookings

**Files**:
- `backend/controllers/shopController.js`
- `backend/controllers/vehicleController.js`
- `backend/controllers/userController.js`

### 3.7 Image Carousel

**Features**:
- Multiple image display
- Left/right navigation
- Dot indicators
- Automatic reset when images change
- Error handling with fallback image

**Implementation**:
```javascript
useEffect(() => {
  setCurrentIndex(0);
  setImageLoaded(false);
}, [images]); // Reset when images change
```

**Files**:
- `frontend/src/components/ImageCarousel.js`

### 3.8 Dashboard Analytics

**Customer Dashboard**:
- Total bookings count
- Active bookings
- Completed bookings
- Booking history with filters

**Shop Owner Dashboard**:
- Total vehicles count
- Available vehicles
- Total bookings
- Active bookings
- Total revenue
- Recent bookings list
- Vehicle management

**Admin Dashboard**:
- Total users count
- Total shops count
- Total vehicles count
- Total bookings count
- Total revenue
- User/shop/vehicle/booking management

**Files**:
- `frontend/src/pages/customer/CustomerDashboard.js`
- `frontend/src/pages/shop/ShopOwnerDashboard.js`
- `frontend/src/pages/admin/AdminDashboard.js`

---

## 4. Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (required),
  role: String (enum: ['customer', 'shop_owner', 'admin']),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Shop Model
```javascript
{
  name: String (required),
  owner: ObjectId (ref: 'User'),
  email: String (required),
  phone: String (required),
  address: {
    street: String,
    city: String (required),
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Vehicle Model
```javascript
{
  name: String (required),
  brand: String (required),
  type: String (enum: ['scooter', 'bike', 'car']),
  shop: ObjectId (ref: 'Shop'),
  images: [String],
  dailyRentInINR: Number (required),
  hourlyRentInINR: Number,
  transmission: String (enum: ['manual', 'automatic']),
  fuelType: String (enum: ['petrol', 'diesel', 'electric', 'hybrid']),
  seatingCapacity: Number,
  mileage: Number,
  features: String,
  isAvailable: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
```javascript
{
  user: ObjectId (ref: 'User'),
  vehicle: ObjectId (ref: 'Vehicle'),
  shop: ObjectId (ref: 'Shop'),
  startDate: Date (required),
  endDate: Date (required),
  totalDays: Number,
  rentalType: String (enum: ['daily', 'hourly']),
  totalAmount: Number,
  totalPrice: Number,
  status: String (enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled']),
  paymentStatus: String (enum: ['pending', 'paid', 'failed']),
  paymentDetails: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Model
```javascript
{
  booking: ObjectId (ref: 'Booking'),
  user: ObjectId (ref: 'User'),
  amount: Number (required),
  method: String (enum: ['razorpay', 'mock']),
  transactionId: String,
  status: String (enum: ['pending', 'success', 'failed']),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 5. API Reference

### Authentication APIs

**Register User**
```
POST /api/auth/register
Body: {
  name, email, password, phone, role,
  shopName (if shop_owner), shopAddress, shopPhone
}
Response: { success: true, token, data: { user, shop } }
```

**Login**
```
POST /api/auth/login
Body: { email, password }
Response: { success: true, token, data: user }
```

**Get Current User**
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { success: true, data: user }
```

### Vehicle APIs

**Get All Vehicles**
```
GET /api/vehicles?type=car&city=Delhi&minPrice=500&maxPrice=2000
Response: { success: true, data: [vehicles] }
```

**Get Single Vehicle**
```
GET /api/vehicles/:id
Response: { success: true, data: vehicle }
```

**Create Vehicle** (Shop Owner)
```
POST /api/vehicles
Headers: Authorization: Bearer <token>
Body: FormData with images + vehicle data
Response: { success: true, data: vehicle }
```

**Update Vehicle** (Shop Owner)
```
PUT /api/vehicles/:id
Headers: Authorization: Bearer <token>
Body: FormData with updated data
Response: { success: true, data: vehicle }
```

**Delete Vehicle** (Shop Owner)
```
DELETE /api/vehicles/:id
Headers: Authorization: Bearer <token>
Response: { success: true, message: "Vehicle deleted" }
```

### Booking APIs

**Create Booking**
```
POST /api/bookings
Headers: Authorization: Bearer <token>
Body: { vehicleId, startDate, endDate, rentalType }
Response: { success: true, data: booking }
```

**Get User Bookings**
```
GET /api/bookings
Headers: Authorization: Bearer <token>
Response: { success: true, data: [bookings] }
```

**Update Booking Status** (Shop Owner)
```
PUT /api/bookings/:id
Headers: Authorization: Bearer <token>
Body: { status: "ongoing" }
Response: { success: true, data: booking }
```

**Cancel Booking**
```
DELETE /api/bookings/:id
Headers: Authorization: Bearer <token>
Response: { success: true, message: "Booking cancelled" }
```

### Payment APIs

**Create Payment Order**
```
POST /api/payments/create
Headers: Authorization: Bearer <token>
Body: { bookingId }
Response: { 
  success: true,
  data: { orderId, amount, currency, keyId }
}
```

**Verify Payment**
```
POST /api/payments/verify
Headers: Authorization: Bearer <token>
Body: {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  bookingId
}
Response: { success: true, data: { payment, booking } }
```

---

## 6. Frontend Structure

### State Management

**AuthContext** - Global authentication state
```javascript
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user, login, logout, register functions
};
```

### Routing Structure

```javascript
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/vehicles" element={<VehicleList />} />
  <Route path="/vehicles/:id" element={<VehicleDetail />} />
  
  {/* Customer Routes */}
  <Route path="/customer/dashboard" element={
    <PrivateRoute allowedRoles={['customer']}>
      <CustomerDashboard />
    </PrivateRoute>
  } />
  <Route path="/customer/payment" element={
    <PrivateRoute allowedRoles={['customer']}>
      <Payment />
    </PrivateRoute>
  } />
  
  {/* Shop Owner Routes */}
  <Route path="/shop/dashboard" element={
    <PrivateRoute allowedRoles={['shop_owner']}>
      <ShopOwnerDashboard />
    </PrivateRoute>
  } />
  
  {/* Admin Routes */}
  <Route path="/admin/dashboard" element={
    <PrivateRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </PrivateRoute>
  } />
</Routes>
```

### Styling System

**Tailwind Configuration**:
```javascript
theme: {
  extend: {
    colors: {
      'luxury-black': '#0A0A0A',
      'luxury-dark': '#1A1A1A',
      'luxury-charcoal': '#36454F',
      'luxury-gold': '#D4AF37',
    },
    fontFamily: {
      display: ['Montserrat', 'sans-serif'],
      body: ['Inter', 'sans-serif'],
    }
  }
}
```

**Global CSS** (`index.css`):
- Input field styling with dark background
- White text for all inputs
- Gold focus states
- Autofill style overrides
- Custom scrollbar

---

## 7. Bug Fixes & Improvements

### Issue 1: Image Visibility Problems
**Problem**: Images only visible after page refresh
**Solution**: 
- Added `useEffect` to reset ImageCarousel when images change
- Added `key={vehicle._id}` to force component remount
- Reset loading state in VehicleDetail on navigation

**Files Changed**:
- `frontend/src/components/ImageCarousel.js`
- `frontend/src/pages/VehicleDetail.js`

### Issue 2: Dashboard Not Updating After Add/Edit
**Problem**: New vehicles didn't appear until manual refresh
**Solution**:
- Added navigation state: `navigate('/shop/dashboard', { state: { refresh: true } })`
- Updated useEffect dependency: `[location.state?.refresh]`

**Files Changed**:
- `frontend/src/pages/shop/AddVehicle.js`
- `frontend/src/pages/shop/EditVehicle.js`
- `frontend/src/pages/shop/ShopOwnerDashboard.js`

### Issue 3: Login Validation Bug
**Problem**: Users couldn't login - validation function returned boolean but component expected object
**Root Cause**: 
```javascript
// Wrong: validateEmail returned boolean
return emailRegex.test(email);

// Component expected object
if (!emailValidation.isValid) { ... }
```

**Solution**: Updated all validation functions to return consistent format
```javascript
return {
  isValid: emailRegex.test(email),
  message: isValid ? '' : 'Please enter a valid email address'
};
```

**Files Changed**:
- `frontend/src/utils/validation.js`

### Issue 4: Orphaned Vehicle Deletion Error
**Problem**: Couldn't delete vehicles after deleting their shop
**Error**: "Cannot read properties of null (reading 'owner')"
**Solution**: Added null check before accessing vehicle.shop.owner
```javascript
if (vehicle.shop) {
  // Check ownership
} else if (req.user.role !== 'admin') {
  return res.status(401).json({ message: 'Not authorized' });
}
```

**Files Changed**:
- `backend/controllers/vehicleController.js`

### Issue 5: Text Visibility Issues
**Problem**: Labels and headings barely visible on light backgrounds
**Solution**: Updated all text colors from `text-gray-600` to `text-gray-900` and added `font-semibold`

**Files Changed**:
- `frontend/src/pages/shop/ShopOwnerDashboard.js`
- `frontend/src/pages/customer/CustomerDashboard.js`
- `frontend/src/pages/VehicleList.js`
- `frontend/src/pages/Register.js`

---

## 8. Deployment Guide

### Prerequisites
1. MongoDB Atlas account
2. Razorpay account (for payments)
3. Hosting service (Vercel for frontend, Render/Railway for backend)

### Environment Variables

**Backend (.env)**:
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ridehub
JWT_SECRET=your_secure_32_char_secret_key
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret
PAYMENT_MODE=razorpay
```

**Frontend**:
Update API base URL in `src/utils/api.js`:
```javascript
const api = axios.create({
  baseURL: 'https://your-backend-url.com/api',
});
```

### Deployment Steps

**1. Backend (Render/Railway)**:
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# On Render/Railway:
- Connect GitHub repository
- Set root directory to "backend"
- Set build command: npm install
- Set start command: npm start
- Add environment variables
```

**2. Frontend (Vercel)**:
```bash
# Push to GitHub (if not done)
git push origin main

# On Vercel:
- Import GitHub repository
- Set root directory to "frontend"
- Framework preset: Create React App
- Build command: npm run build
- Output directory: build
- Deploy
```

**3. Database Setup**:
- Create MongoDB Atlas cluster
- Allow all IPs (0.0.0.0/0) or specific deployment IPs
- Run seeder to populate initial data

**4. Payment Setup**:
- Get Razorpay live keys
- Update backend .env
- Test payment flow

### Post-Deployment Testing
1. ✅ User registration & login
2. ✅ Vehicle listing & search
3. ✅ Booking creation
4. ✅ Payment processing
5. ✅ Dashboard analytics
6. ✅ Image uploads
7. ✅ Role-based access

---

## 9. Future Enhancements

### Potential Features
1. **Reviews & Ratings** - Customer reviews for vehicles
2. **Real-time Chat** - Customer-shop owner messaging
3. **GPS Tracking** - Track vehicle location during rental
4. **Insurance Integration** - Optional insurance during booking
5. **Mobile App** - React Native app
6. **Advanced Analytics** - Revenue graphs, popular vehicles
7. **Email Notifications** - Booking confirmations, reminders
8. **Multi-language Support** - Hindi, regional languages
9. **Loyalty Program** - Points system for frequent customers
10. **Vehicle Comparison** - Compare multiple vehicles side-by-side

### Technical Improvements
1. **Redis Caching** - Cache frequently accessed data
2. **WebSockets** - Real-time notifications
3. **Image Optimization** - Compress images on upload
4. **CDN Integration** - CloudFront/Cloudinary for images
5. **API Rate Limiting** - Prevent abuse
6. **Logging System** - Winston/Morgan for production logs
7. **Testing** - Jest unit tests, Cypress E2E tests
8. **Docker** - Containerize application
9. **CI/CD** - Automated deployment pipeline
10. **Monitoring** - Sentry error tracking, analytics

---

## 10. Maintenance & Support

### Regular Tasks
- **Weekly**: Check error logs, monitor performance
- **Monthly**: Database backup, dependency updates
- **Quarterly**: Security audit, feature planning

### Common Issues & Solutions

**Issue**: Images not loading
- Check uploads folder permissions
- Verify image paths in database
- Check CORS settings

**Issue**: Payment failures
- Verify Razorpay keys
- Check webhook configurations
- Review payment logs

**Issue**: Slow API responses
- Add database indexes
- Implement caching
- Optimize queries with populate

### Contact & Support
For technical issues or feature requests, contact the development team.

---

**Last Updated**: November 24, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
