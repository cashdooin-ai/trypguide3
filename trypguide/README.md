# TrypGuide - Travel Booking Platform

A full-stack travel booking platform like EasyMyTrip for booking flights, hotels, trains, and buses.

## 🚀 Phase 1 Features

- ✅ Flight search and booking
- ✅ User authentication (Register/Login)
- ✅ Mock flight data with filters
- ✅ Responsive UI with Tailwind CSS
- ✅ PostgreSQL database with partitioning
- ✅ Redis caching
- ✅ RESTful API with Express.js

## 📁 Project Structure

```
trypguide/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite frontend
├── docker-compose.yml
└── README.md
```

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- React DatePicker

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- Redis
- JWT Authentication
- Bcrypt

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 7+

OR

- Docker and Docker Compose (easier option)

## 🚀 Quick Start with Docker

```bash
# 1. Navigate to project directory
cd trypguide

# 2. Start all services
docker-compose up -d

# 3. The application will be running at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

## 💻 Manual Setup

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trypguide
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key

# Run database migrations
npm run migrate

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update if needed (default works with backend on localhost:5000)
VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev

# App runs on http://localhost:3000
```

## 🗄️ Database Setup

### PostgreSQL Setup

```bash
# Create database
createdb trypguide

# Run migrations
psql -d trypguide -f backend/database/migrations/001_initial_schema.sql

# Optional: Load airport data
psql -d trypguide -f backend/database/seeds/airports.sql
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update profile (requires auth)

### Flights
- `GET /api/flights/search` - Search flights
- `POST /api/flights/filter` - Filter flights
- `GET /api/flights/airports` - Get airports list

### Bookings
- `POST /api/bookings` - Create booking (requires auth)
- `GET /api/bookings` - Get user bookings (requires auth)
- `GET /api/bookings/:id` - Get booking by ID (requires auth)
- `GET /api/bookings/pnr/:pnr` - Get booking by PNR
- `POST /api/bookings/:id/confirm` - Confirm booking (requires auth)
- `POST /api/bookings/:id/cancel` - Cancel booking (requires auth)

## 🔐 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trypguide
DB_USER=postgres
DB_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=TrypGuide
```

## 📤 Upload to GitHub

1. Create a new repository on GitHub
2. Initialize and push your code:

```bash
git init
git add .
git commit -m "Initial commit - TrypGuide Phase 1"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/trypguide.git
git push -u origin main
```

## 🚂 Deploy to Railway

1. Connect your GitHub repository to Railway
2. Create a new project
3. Add PostgreSQL and Redis services
4. Set environment variables in Railway dashboard
5. Deploy!

Railway will auto-detect and deploy both frontend and backend.

## 🎯 Next Steps (Phase 2)

- [ ] Payment integration (Razorpay/Stripe)
- [ ] Email confirmations
- [ ] Booking management (modify/cancel)
- [ ] Hotel booking system
- [ ] Train booking system
- [ ] Admin dashboard

## 📝 License

MIT License

## 👨‍💻 Author

Built with ❤️ for TrypGuide

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@trypguide.com or open an issue on GitHub.
