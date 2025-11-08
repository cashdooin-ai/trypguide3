-- Seed data for Indian airports
-- This can be loaded after the schema is created

CREATE TABLE IF NOT EXISTS airports (
    code VARCHAR(3) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    timezone VARCHAR(50),
    coordinates JSONB
);

INSERT INTO airports (code, name, city, country, timezone, coordinates) VALUES
('DEL', 'Indira Gandhi International Airport', 'Delhi', 'India', 'Asia/Kolkata', '{"lat": 28.5562, "lng": 77.1000}'),
('BOM', 'Chhatrapati Shivaji Maharaj International Airport', 'Mumbai', 'India', 'Asia/Kolkata', '{"lat": 19.0896, "lng": 72.8656}'),
('BLR', 'Kempegowda International Airport', 'Bangalore', 'India', 'Asia/Kolkata', '{"lat": 13.1979, "lng": 77.7063}'),
('MAA', 'Chennai International Airport', 'Chennai', 'India', 'Asia/Kolkata', '{"lat": 12.9941, "lng": 80.1709}'),
('HYD', 'Rajiv Gandhi International Airport', 'Hyderabad', 'India', 'Asia/Kolkata', '{"lat": 17.2403, "lng": 78.4294}'),
('CCU', 'Netaji Subhas Chandra Bose International Airport', 'Kolkata', 'India', 'Asia/Kolkata', '{"lat": 22.6520, "lng": 88.4463}'),
('GOI', 'Goa International Airport', 'Goa', 'India', 'Asia/Kolkata', '{"lat": 15.3808, "lng": 73.8314}'),
('COK', 'Cochin International Airport', 'Kochi', 'India', 'Asia/Kolkata', '{"lat": 10.1520, "lng": 76.4019}'),
('PNQ', 'Pune Airport', 'Pune', 'India', 'Asia/Kolkata', '{"lat": 18.5822, "lng": 73.9197}'),
('AMD', 'Sardar Vallabhbhai Patel International Airport', 'Ahmedabad', 'India', 'Asia/Kolkata', '{"lat": 23.0772, "lng": 72.6347}'),
('JAI', 'Jaipur International Airport', 'Jaipur', 'India', 'Asia/Kolkata', '{"lat": 26.8242, "lng": 75.8122}'),
('LKO', 'Chaudhary Charan Singh International Airport', 'Lucknow', 'India', 'Asia/Kolkata', '{"lat": 26.7606, "lng": 80.8893}'),
('GAU', 'Lokpriya Gopinath Bordoloi International Airport', 'Guwahati', 'India', 'Asia/Kolkata', '{"lat": 26.1061, "lng": 91.5859}'),
('TRV', 'Trivandrum International Airport', 'Thiruvananthapuram', 'India', 'Asia/Kolkata', '{"lat": 8.4821, "lng": 76.9200}'),
('IXC', 'Chandigarh International Airport', 'Chandigarh', 'India', 'Asia/Kolkata', '{"lat": 30.6735, "lng": 76.7885}')
ON CONFLICT (code) DO NOTHING;

CREATE INDEX idx_airports_city ON airports(city);
CREATE INDEX idx_airports_country ON airports(country);

COMMENT ON TABLE airports IS 'Airport master data';
