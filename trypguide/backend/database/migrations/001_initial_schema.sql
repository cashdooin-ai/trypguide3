-- TrypGuide Database Schema
-- PostgreSQL Database Setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- Bookings table (partitioned by booking_date for performance)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    booking_type VARCHAR(20) NOT NULL, -- 'flight', 'hotel', 'train', 'bus'
    pnr VARCHAR(10) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    travel_date DATE NOT NULL,
    passengers_count INTEGER NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, booking_date)
) PARTITION BY RANGE (booking_date);

-- Create partitions for current and next year
CREATE TABLE IF NOT EXISTS bookings_2024 PARTITION OF bookings
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE IF NOT EXISTS bookings_2025 PARTITION OF bookings
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE IF NOT EXISTS bookings_2026 PARTITION OF bookings
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_pnr ON bookings(pnr);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_travel_date ON bookings(travel_date);

-- Flight bookings table
CREATE TABLE IF NOT EXISTS flight_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL,
    airline_code VARCHAR(10),
    flight_number VARCHAR(10),
    from_airport VARCHAR(3),
    to_airport VARCHAR(3),
    departure_time TIMESTAMP,
    arrival_time TIMESTAMP,
    cabin_class VARCHAR(20),
    booking_class VARCHAR(10),
    passengers JSONB NOT NULL,
    baggage_info JSONB,
    seat_info JSONB,
    meal_preferences JSONB,
    ticket_numbers JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_flight_bookings_booking_id ON flight_bookings(booking_id);
CREATE INDEX idx_flight_bookings_departure ON flight_bookings(departure_time);
CREATE INDEX idx_flight_bookings_airline ON flight_bookings(airline_code);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'payment', 'refund'
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(50),
    gateway_transaction_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'success', 'failed', 'refunded'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_booking_id ON transactions(booking_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_gateway_id ON transactions(gateway_transaction_id);

-- Saved travelers table (for quick booking)
CREATE TABLE IF NOT EXISTS saved_travelers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(10),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    nationality VARCHAR(50),
    passport_number VARCHAR(50),
    passport_expiry DATE,
    frequent_flyer_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_saved_travelers_user_id ON saved_travelers(user_id);

-- Search history table (for analytics and personalization)
CREATE TABLE IF NOT EXISTS search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    search_type VARCHAR(20), -- 'flight', 'hotel', etc.
    from_location VARCHAR(10),
    to_location VARCHAR(10),
    departure_date DATE,
    return_date DATE,
    passengers INTEGER,
    search_params JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_travelers_updated_at BEFORE UPDATE ON saved_travelers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample airports data (optional)
COMMENT ON TABLE users IS 'User accounts and profiles';
COMMENT ON TABLE bookings IS 'All booking records across different services';
COMMENT ON TABLE flight_bookings IS 'Flight-specific booking details';
COMMENT ON TABLE transactions IS 'Payment and refund transactions';
COMMENT ON TABLE saved_travelers IS 'Saved passenger information for quick booking';
COMMENT ON TABLE search_history IS 'User search history for analytics';
