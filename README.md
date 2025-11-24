# 🚗 RideHub - Premium Indian Vehicle Rental Platform

A complete, production-ready full-stack **luxury vehicle rental platform** built with React, Node.js, Express, MongoDB, and Tailwind CSS. Features a **premium dark theme with gold accents**, inspired by BigBoyToyz and BMW.

## 🎨 NEW: Luxury Redesign

**RideHub now features a premium luxury design:**
- ✨ **Dark Theme:** Black backgrounds with gold accents
- 🎭 **Smooth Animations:** Framer Motion throughout
- 📱 **Glass-morphism UI:** Modern transparent effects
- ⚡ **Sticky Navigation:** Transparent to solid on scroll
- 🎯 **Premium Typography:** Montserrat + Inter fonts
- 🃏 **Curved Cards:** Luxury vehicle showcases
- 📊 **Animated Counters:** 7600+ customers, 500+ vehicles
- 🏪 **Showroom Section:** Mumbai, Delhi, Bangalore
- 📱 **App Download:** Google Play + App Store buttons

**Design Inspiration:** BigBoyToyz + BMW

## ✨ Features

### Customer Features
- 🔐 Sign up & login with JWT authentication
- 🔍 Browse scooters, bikes, and cars by city, type, price, and category
- 📍 Find nearby rental shops using geolocation
- 📅 Book vehicles for specific date ranges
- 💳 Pay online (Stripe or mock payment)
- 📊 View booking history and payment records
- ❌ Cancel bookings

### Shop Owner Features
- 🏪 Register as shop owner with shop details
- 🚗 Add/edit/delete vehicles with multiple photos
- 💰 Set custom daily and hourly rental rates
- 📋 Manage bookings for their shop
- 🛣️ Record start & end odometer readings
- 📊 View shop statistics (revenue, bookings, distance)
- 👥 Track customers and booking history

### Admin Features (Optional)
- 👨‍💼 Manage users, shops, vehicles, and bookings

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - REST API server
- **MongoDB** + **Mongoose** - Database with geospatial queries
- **JWT** - Authentication
- **Multer** - Image uploads
- **Stripe** - Payment integration (optional)
- **bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Modern styling
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library
- **date-fns** - Date formatting

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. **Configure environment variables:**
Edit `.env` file:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/ridehub

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=30d

# Cloudinary (required for production image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (optional - for real payments)s)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Payment Mode (razorpay or mock)
PAYMENT_MODE=mock
```

5. **Start MongoDB:**
```bash
# If using local MongoDB
mongod
```

6. **Seed the database (Optional):**
```bash
npm run seed
```

This will create:
- Sample users (admin, shop owners, customers)
- Demo shops in major cities
- Sample vehicles across categories

7. **Start the backend server:**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start the development server:**
```bash
npm start
```

Frontend will open at `http://localhost:3000`

## 🎯 Usage Guide

### For Customers

1. **Sign Up / Login:**
   - Go to Register page
   - Select "Customer" role
   - Fill in your details
   - Login with credentials

2. **Browse Vehicles:**
   - Use the homepage search
   - Filter by type, city, price range
   - View vehicle details with image carousel

3. **Book a Vehicle:**
   - Select dates and rental type (daily/hourly)
   - Review total amount
   - Click "Book Now"
   - Complete payment

4. **Manage Bookings:**
   - View all bookings in dashboard
   - Track booking status
   - Cancel if needed

### For Shop Owners

1. **Register Your Shop:**
   - Select "Shop Owner" during registration
   - Provide shop details including:
     - Shop name and address
     - City and pincode
     - GPS coordinates (latitude/longitude)

2. **Add Vehicles:**
   - Go to Shop Dashboard
   - Click "Add Vehicle"
   - Fill vehicle details:
     - Name, brand, type
     - Engine capacity (CC)
     - Transmission, fuel type
     - Daily and hourly rates
     - Upload multiple images
     - Add features

3. **Manage Bookings:**
   - View all bookings for your shop
   - Update booking status
   - Record odometer readings:
     - Start reading at pickup
     - End reading at return
   - System auto-calculates distance traveled

4. **View Analytics:**
   - Total bookings and revenue
   - Vehicle utilization
   - Distance statistics

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login
GET    /api/auth/me             - Get current user
PUT    /api/auth/updatedetails  - Update profile
PUT    /api/auth/updatepassword - Change password
```

### Shops
```
GET    /api/shops               - Get all shops (with filters)
GET    /api/shops/:id           - Get single shop
POST   /api/shops               - Create shop (shop_owner)
PUT    /api/shops/:id           - Update shop (shop_owner)
DELETE /api/shops/:id           - Delete shop (shop_owner)
GET    /api/shops/me/myshop     - Get my shop (shop_owner)
```

### Vehicles
```
GET    /api/vehicles                      - Get all vehicles
GET    /api/vehicles/:id                  - Get single vehicle
POST   /api/vehicles                      - Create vehicle (shop_owner)
PUT    /api/vehicles/:id                  - Update vehicle (shop_owner)
DELETE /api/vehicles/:id                  - Delete vehicle (shop_owner)
GET    /api/vehicles/shop/myvehicles      - Get my shop vehicles
POST   /api/vehicles/:id/check-availability - Check availability
```

### Bookings
```
POST   /api/bookings                 - Create booking (customer)
GET    /api/bookings/my              - Get my bookings (customer)
GET    /api/bookings/shop            - Get shop bookings (shop_owner)
GET    /api/bookings/:id             - Get single booking
PUT    /api/bookings/:id/status      - Update status (shop_owner)
PUT    /api/bookings/:id/record-odo  - Record odometer (shop_owner)
PUT    /api/bookings/:id/cancel      - Cancel booking (customer)
GET    /api/bookings/shop/stats      - Get shop stats (shop_owner)
```

### Payments
```
POST   /api/payments/create          - Create payment
POST   /api/payments/confirm         - Confirm payment
GET    /api/payments/my              - Get my payments
GET    /api/payments/booking/:id     - Get payment by booking
GET    /api/payments/:id             - Get payment details
```

## 🎨 Key Features Implemented

### 1. **Dynamic Image Carousels**
- Auto-sliding image galleries
- Smooth transitions with fade effects
- Dot indicators and navigation arrows
- Mobile responsive

### 2. **Geospatial Search**
- MongoDB 2dsphere index
- Find shops within radius
- Latitude/longitude support

### 3. **Smart Booking System**
- Prevents overlapping bookings
- Calculates rental duration
- Supports hourly and daily rates
- Date validation

### 4. **Odometer Tracking**
- Record start/end readings
- Auto-calculate distance
- Update vehicle total km
- Track per-booking usage

### 5. **Payment Integration**
- Mock payment mode (default)
- Stripe integration ready
- Payment status tracking
- Booking confirmation on payment

### 6. **Responsive Design**
- Mobile-first approach
- Tailwind CSS utilities
- Smooth animations
- Loading states

## 🔧 Configuration Options

### Switch Payment Mode

**Mock Payment (Default):**
```env
PAYMENT_MODE=mock
```
- Instant payment success
- No external dependencies
- Perfect for development

**Razorpay Payment:**
```env
PAYMENT_MODE=razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
```
- Real payment processing
- Test mode available
- Indian payment gateway

### Image Uploads

**Cloudinary (Production - Currently Configured):**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
- Images stored in cloud
- Automatic transformations (1200x800)
- Persistent storage across deployments
- CDN delivery for fast loading

### Custom Pricing

Shop owners can set:
- **Daily rates** - Per 24-hour period
- **Hourly rates** - For short rentals
- **Both** - Customers choose preference

## 📱 Screenshots & Features

### Customer Journey
1. **Homepage** - Hero section with search
2. **Vehicle Listing** - Grid with filters
3. **Vehicle Detail** - Full specs + booking form
4. **Dashboard** - Track all bookings
5. **Payment** - Secure checkout

### Shop Owner Journey
1. **Registration** - With shop details
2. **Dashboard** - Stats & overview
3. **Add Vehicle** - Multi-image upload
4. **Manage Bookings** - Status updates
5. **Odometer Entry** - Track usage

## 🚀 Deployment

### Backend (Render - Currently Deployed)
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables:
   - NODE_ENV=production
   - PORT=5000
   - MONGO_URI (MongoDB Atlas)
   - JWT_SECRET
   - JWT_EXPIRE
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   - RAZORPAY_KEY_ID
   - RAZORPAY_KEY_SECRET
   - PAYMENT_MODE
4. Auto-deploy on GitHub push

### Frontend (Vercel - Currently Deployed)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable:
   - REACT_APP_API_URL (your Render backend URL)
4. Auto-deploy on GitHub push

### Database (MongoDB Atlas)
1. Create cluster
2. Whitelist IPs (0.0.0.0/0 for production)
3. Create database user
4. Update MONGO_URI in backend environment variables

## 🧪 Testing

### Test Workflow
1. Register as a new customer or use seeded data
2. Browse available vehicles
3. Book a vehicle with date selection
4. Complete mock payment
5. Login as shop owner
6. View booking in shop dashboard
7. Update booking status
8. Record odometer readings

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongo --version
mongod

# Or use MongoDB Atlas connection string
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ridehub
```

### Port Already in Use
```bash
# Change port in .env
PORT=5001
```

### CORS Issues
- Ensure backend CORS is enabled
- Check API_URL in frontend .env
- Verify ports match

### Seeder Issues
```bash
# Clear and reseed database
npm run seed -- -d  # Delete data
npm run seed        # Import fresh data
```

## 📚 Project Structure

```
ridehub/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── shopController.js
│   │   ├── vehicleController.js
│   │   ├── bookingController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── error.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Shop.js
│   │   ├── Vehicle.js
│   │   ├── Booking.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── shopRoutes.js
│   │   ├── vehicleRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── paymentRoutes.js
│   ├── .env
│   ├── package.json
│   ├── seeder.js
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Footer.js
    │   │   ├── ImageCarousel.js
    │   │   ├── Loading.js
    │   │   └── PrivateRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── VehicleList.js
    │   │   ├── VehicleDetail.js
    │   │   ├── customer/
    │   │   │   └── CustomerDashboard.js
    │   │   └── shop/
    │   │       └── ShopOwnerDashboard.js
    │   ├── services/
    │   │   └── api.service.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    ├── .env
    ├── package.json
    └── tailwind.config.js
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

Built with ❤️ for the Indian vehicle rental market.

## 🎉 Features Summary

✅ Multi-role authentication (Customer, Shop Owner, Admin)  
✅ Shop registration with geolocation  
✅ Vehicle CRUD with image uploads  
✅ Advanced search and filters  
✅ Real-time booking validation  
✅ Hourly and daily rental options  
✅ Odometer tracking system  
✅ Payment integration (Mock/Stripe)  
✅ Responsive UI with Tailwind CSS  
✅ Dynamic image carousels  
✅ Toast notifications  
✅ Loading states  
✅ Error handling  
✅ Database seeder  
✅ Production-ready architecture  

---

**Happy Renting! 🚗🏍️🛵**
