// Mock flight data for development
const airlines = [
  { code: 'AI', name: 'Air India', logo: '✈️' },
  { code: '6E', name: 'IndiGo', logo: '🛫' },
  { code: 'SG', name: 'SpiceJet', logo: '🌶️' },
  { code: 'UK', name: 'Vistara', logo: '⭐' },
  { code: 'G8', name: 'Go First', logo: '🚀' },
  { code: 'I5', name: 'AirAsia India', logo: '🔴' }
];

const airports = {
  DEL: { name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India' },
  BOM: { name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India' },
  BLR: { name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India' },
  MAA: { name: 'Chennai International Airport', city: 'Chennai', country: 'India' },
  HYD: { name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India' },
  CCU: { name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', country: 'India' },
  GOI: { name: 'Goa International Airport', city: 'Goa', country: 'India' },
  COK: { name: 'Cochin International Airport', city: 'Kochi', country: 'India' },
  PNQ: { name: 'Pune Airport', city: 'Pune', country: 'India' },
  AMD: { name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', country: 'India' }
};

// Generate random flight times
const generateFlightTimes = (baseDate, durationMinutes) => {
  const departure = new Date(baseDate);
  const hours = Math.floor(Math.random() * 16) + 6; // Between 6 AM and 10 PM
  const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  departure.setHours(hours, minutes, 0, 0);

  const arrival = new Date(departure.getTime() + durationMinutes * 60000);

  return {
    departure: departure.toISOString(),
    arrival: arrival.toISOString()
  };
};

// Generate mock flights
const generateMockFlights = (from, to, date, passengers = 1) => {
  const flights = [];
  const flightDate = new Date(date);
  
  // Base price calculation
  const basePrice = Math.floor(Math.random() * 3000) + 2000;
  
  // Generate 10-15 flights
  const flightCount = Math.floor(Math.random() * 6) + 10;

  for (let i = 0; i < flightCount; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const duration = Math.floor(Math.random() * 120) + 60; // 1-3 hours
    const times = generateFlightTimes(flightDate, duration);
    
    // Random stops (70% non-stop, 30% with stops)
    const stops = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : 2) : 0;
    
    const price = basePrice + (Math.random() * 2000) - 1000;
    const pricePerPassenger = Math.floor(price);

    flights.push({
      id: `FL${Date.now()}-${i}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: `${airline.code}${Math.floor(Math.random() * 900) + 100}`,
      from: from,
      to: to,
      fromAirport: airports[from],
      toAirport: airports[to],
      departureTime: times.departure,
      arrivalTime: times.arrival,
      duration: `${Math.floor(duration / 60)}h ${duration % 60}m`,
      durationMinutes: duration,
      stops: stops,
      stopInfo: stops > 0 ? generateStopInfo(stops) : null,
      price: pricePerPassenger * passengers,
      pricePerPassenger: pricePerPassenger,
      currency: 'INR',
      availableSeats: Math.floor(Math.random() * 50) + 10,
      cabinClass: 'Economy',
      baggage: {
        checkin: '15 Kg',
        cabin: '7 Kg'
      },
      refundable: Math.random() > 0.5,
      amenities: generateAmenities()
    });
  }

  // Sort by price
  return flights.sort((a, b) => a.price - b.price);
};

const generateStopInfo = (stopCount) => {
  const cities = ['DEL', 'BOM', 'BLR', 'HYD'];
  const stops = [];
  
  for (let i = 0; i < stopCount; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    stops.push({
      airport: city,
      airportName: airports[city].name,
      layoverTime: `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(Math.random() * 60)}m`
    });
  }
  
  return stops;
};

const generateAmenities = () => {
  const allAmenities = ['WiFi', 'Meals', 'Entertainment', 'Power Outlet', 'USB Port'];
  const count = Math.floor(Math.random() * 3) + 2;
  return allAmenities.slice(0, count);
};

module.exports = {
  generateMockFlights,
  airlines,
  airports
};
