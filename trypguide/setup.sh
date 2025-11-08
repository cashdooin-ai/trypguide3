#!/bin/bash

echo "🚀 TrypGuide Setup Script"
echo "=========================="
echo ""

# Check if Docker is installed
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "✅ Docker detected"
    echo ""
    echo "Starting services with Docker Compose..."
    docker-compose up -d
    echo ""
    echo "✅ Services started!"
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:5000"
    echo ""
else
    echo "⚠️  Docker not found. Installing manually..."
    echo ""
    
    # Backend setup
    echo "📦 Setting up backend..."
    cd backend
    cp .env.example .env
    npm install
    echo "✅ Backend dependencies installed"
    echo ""
    
    # Frontend setup
    cd ../frontend
    echo "📦 Setting up frontend..."
    cp .env.example .env
    npm install
    echo "✅ Frontend dependencies installed"
    echo ""
    
    cd ..
    
    echo "⚠️  Manual setup required:"
    echo "1. Install PostgreSQL and create 'trypguide' database"
    echo "2. Install Redis"
    echo "3. Update backend/.env with your database credentials"
    echo "4. Run database migrations: psql -d trypguide -f backend/database/migrations/001_initial_schema.sql"
    echo ""
    echo "To start the application:"
    echo "Backend: cd backend && npm run dev"
    echo "Frontend: cd frontend && npm run dev"
fi

echo ""
echo "📖 Read README.md for detailed instructions"
echo "🎉 Setup complete!"
