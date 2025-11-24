# 🚗 RideHub - Vehicle Rental Platform

A modern, full-stack vehicle rental platform built with MERN stack, featuring a luxury-themed UI and complete booking management system.

![RideHub Banner](https://img.shields.io/badge/RideHub-Vehicle%20Rental-gold?style=for-the-badge)

## ✨ Features

### 👥 User Roles
- **Customers** - Browse, search, and book vehicles with integrated payment
- **Shop Owners** - Manage vehicles, bookings, and track revenue
- **Admin** - Complete platform management and oversight

### 🔥 Core Features
- 🔐 Secure JWT authentication with role-based access
- 🔍 Advanced search and filtering (type, price, city, fuel type, transmission)
- 📸 Multi-image upload with camera capture support
- 💳 Razorpay payment integration (mock mode for testing)
- 📱 Fully responsive luxury-themed design
- 📊 Real-time dashboard analytics for all user types
- 🗺️ Location-based vehicle discovery
- 📅 Booking management with status tracking
- 🖼️ Image carousel for vehicle galleries
- ♻️ Cascade deletion for data integrity

## 🛠️ Tech Stack

**Frontend:**
- React 18 with React Router v6
- Tailwind CSS for styling
- Axios for API calls
- React Toastify for notifications
- React Icons

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Multer for file uploads
- Razorpay for payments
- Bcrypt for password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/RideHub.git
cd RideHub
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
PAYMENT_MODE=mock
```

Start backend server:
```bash
npm start
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
npm start
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
RideHub/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & upload middleware
│   ├── uploads/         # Uploaded images
│   └── server.js        # Entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # Reusable components
│       ├── context/     # React context
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── utils/       # Helper functions
└── README.md
```

## 🎨 Key Features Breakdown

### Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (Customer, Shop Owner, Admin)
- Protected routes and API endpoints

### Vehicle Management
- CRUD operations for vehicles
- Multi-image upload with preview
- Camera capture for mobile devices
- Image carousel display
- Automatic image cleanup on deletion

### Booking System
- Date-based availability checking
- Real-time booking status updates
- Payment integration with Razorpay
- Booking history and management

### Search & Filters
- Filter by vehicle type, price range, city
- Filter by transmission and fuel type
- Real-time search results

### Dashboard Analytics
- Customer: Booking history, active bookings
- Shop Owner: Revenue tracking, vehicle stats, booking management
- Admin: Platform-wide statistics and user management

## 🔐 Default Test Accounts

Run seeder to create test accounts:
```bash
cd backend
node seeder.js
```

**Admin:**
- Email: admin@ridehub.com
- Password: admin123

**Shop Owner:**
- Email: rajesh@shop.com
- Password: shop123

**Customer:**
- Email: john@customer.com
- Password: customer123

## 💳 Payment Setup

The app uses Razorpay for payments. By default, it runs in **mock mode** for testing.

To enable real payments:
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your API keys
3. Update `backend/.env`:
```env
RAZORPAY_KEY_ID=your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_secret
PAYMENT_MODE=razorpay
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get single vehicle
- `POST /api/vehicles` - Create vehicle (Auth: Shop Owner)
- `PUT /api/vehicles/:id` - Update vehicle (Auth: Shop Owner)
- `DELETE /api/vehicles/:id` - Delete vehicle (Auth: Shop Owner)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### Payments
- `POST /api/payments/create` - Create payment order
- `POST /api/payments/verify` - Verify payment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Vehicle images from sample data
- Tailwind CSS for styling
- MongoDB Atlas for database hosting
- Razorpay for payment processing

---

⭐ Star this repo if you find it helpful!
