const FlightService = require('../services/flightService');

// Search flights
exports.searchFlights = async (req, res, next) => {
  try {
    const {
      from,
      to,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      cabinClass,
      tripType
    } = req.query;

    // Validation
    if (!from || !to || !departureDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: from, to, departureDate'
      });
    }

    const searchParams = {
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      departureDate,
      returnDate: returnDate || null,
      adults: parseInt(adults) || 1,
      children: parseInt(children) || 0,
      infants: parseInt(infants) || 0,
      cabinClass: cabinClass || 'Economy',
      tripType: tripType || 'one-way'
    };

    const results = await FlightService.searchFlights(searchParams);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// Filter and sort flights
exports.filterFlights = async (req, res, next) => {
  try {
    const { flights, filters, sortBy } = req.body;

    if (!flights || !Array.isArray(flights)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid flights data'
      });
    }

    let result = flights;

    // Apply filters if provided
    if (filters) {
      result = FlightService.applyFilters(result, filters);
    }

    // Apply sorting if provided
    if (sortBy) {
      result = FlightService.sortFlights(result, sortBy);
    }

    res.json({
      success: true,
      data: {
        flights: result,
        count: result.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get flight details
exports.getFlightDetails = async (req, res, next) => {
  try {
    const { flightId } = req.params;

    const flight = await FlightService.getFlightDetails(flightId);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.json({
      success: true,
      data: { flight }
    });
  } catch (error) {
    next(error);
  }
};

// Get available airports
exports.getAirports = async (req, res, next) => {
  try {
    const { search } = req.query;
    
    const airports = [
      { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India' },
      { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India' },
      { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India' },
      { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India' },
      { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India' },
      { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', country: 'India' },
      { code: 'GOI', name: 'Goa International Airport', city: 'Goa', country: 'India' },
      { code: 'COK', name: 'Cochin International Airport', city: 'Kochi', country: 'India' },
      { code: 'PNQ', name: 'Pune Airport', city: 'Pune', country: 'India' },
      { code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', country: 'India' }
    ];

    let filtered = airports;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = airports.filter(airport =>
        airport.city.toLowerCase().includes(searchLower) ||
        airport.code.toLowerCase().includes(searchLower) ||
        airport.name.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      data: { airports: filtered }
    });
  } catch (error) {
    next(error);
  }
};
