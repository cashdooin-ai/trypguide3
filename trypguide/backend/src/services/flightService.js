const { cacheGet, cacheSet } = require('../config/redis');
const { generateMockFlights } = require('./mockFlightData');

class FlightService {
  // Search flights
  static async searchFlights(searchParams) {
    const {
      from,
      to,
      departureDate,
      returnDate,
      adults = 1,
      children = 0,
      infants = 0,
      cabinClass = 'Economy',
      tripType = 'one-way'
    } = searchParams;

    const totalPassengers = adults + children + infants;

    // Generate cache key
    const cacheKey = `flights:${from}:${to}:${departureDate}:${totalPassengers}:${cabinClass}`;

    // Try to get from cache
    const cachedFlights = await cacheGet(cacheKey);
    if (cachedFlights) {
      console.log('Returning cached flights');
      return cachedFlights;
    }

    // Generate mock flights
    const outboundFlights = generateMockFlights(from, to, departureDate, totalPassengers);
    
    let returnFlights = null;
    if (tripType === 'round-trip' && returnDate) {
      returnFlights = generateMockFlights(to, from, returnDate, totalPassengers);
    }

    const result = {
      tripType,
      outbound: outboundFlights,
      return: returnFlights,
      searchParams: {
        from,
        to,
        departureDate,
        returnDate,
        passengers: {
          adults,
          children,
          infants,
          total: totalPassengers
        },
        cabinClass
      }
    };

    // Cache for 30 minutes
    await cacheSet(cacheKey, result, 1800);

    return result;
  }

  // Get flight details by ID
  static async getFlightDetails(flightId) {
    // In production, this would fetch from database or API
    // For now, return null and let the search handle it
    return null;
  }

  // Apply filters to flights
  static applyFilters(flights, filters) {
    let filtered = [...flights];

    // Price range filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      filtered = filtered.filter(flight => {
        const price = flight.pricePerPassenger;
        const min = filters.minPrice || 0;
        const max = filters.maxPrice || Infinity;
        return price >= min && price <= max;
      });
    }

    // Airlines filter
    if (filters.airlines && filters.airlines.length > 0) {
      filtered = filtered.filter(flight => 
        filters.airlines.includes(flight.airlineCode)
      );
    }

    // Stops filter
    if (filters.stops !== undefined) {
      if (filters.stops === 'non-stop') {
        filtered = filtered.filter(flight => flight.stops === 0);
      } else if (filters.stops === '1-stop') {
        filtered = filtered.filter(flight => flight.stops === 1);
      } else if (filters.stops === '2-stops') {
        filtered = filtered.filter(flight => flight.stops >= 2);
      }
    }

    // Departure time filter
    if (filters.departureTime) {
      filtered = filtered.filter(flight => {
        const hour = new Date(flight.departureTime).getHours();
        
        switch (filters.departureTime) {
          case 'early-morning': // 12 AM - 6 AM
            return hour >= 0 && hour < 6;
          case 'morning': // 6 AM - 12 PM
            return hour >= 6 && hour < 12;
          case 'afternoon': // 12 PM - 6 PM
            return hour >= 12 && hour < 18;
          case 'evening': // 6 PM - 12 AM
            return hour >= 18;
          default:
            return true;
        }
      });
    }

    return filtered;
  }

  // Sort flights
  static sortFlights(flights, sortBy) {
    const sorted = [...flights];

    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'duration':
        return sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);
      case 'departure':
        return sorted.sort((a, b) => 
          new Date(a.departureTime) - new Date(b.departureTime)
        );
      case 'arrival':
        return sorted.sort((a, b) => 
          new Date(a.arrivalTime) - new Date(b.arrivalTime)
        );
      default:
        return sorted;
    }
  }
}

module.exports = FlightService;
