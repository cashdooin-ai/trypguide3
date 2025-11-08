const Booking = require('../models/Booking');
const FlightBooking = require('../models/FlightBooking');

// Create new booking
exports.createBooking = async (req, res, next) => {
  try {
    const {
      flightDetails,
      passengers,
      contactInfo,
      paymentInfo
    } = req.body;

    const userId = req.user.id;

    // Generate PNR
    const pnr = Booking.generatePNR();

    // Calculate total amount
    const totalAmount = flightDetails.price;

    // Create main booking
    const booking = await Booking.create({
      userId,
      bookingType: 'flight',
      pnr,
      status: 'pending',
      totalAmount,
      currency: 'INR',
      travelDate: flightDetails.departureTime,
      passengersCount: passengers.length,
      contactEmail: contactInfo.email,
      contactPhone: contactInfo.phone,
      metadata: {
        paymentMethod: paymentInfo.method
      }
    });

    // Create flight booking details
    const flightBooking = await FlightBooking.create({
      bookingId: booking.id,
      airlineCode: flightDetails.airlineCode,
      flightNumber: flightDetails.flightNumber,
      fromAirport: flightDetails.from,
      toAirport: flightDetails.to,
      departureTime: flightDetails.departureTime,
      arrivalTime: flightDetails.arrivalTime,
      cabinClass: flightDetails.cabinClass,
      bookingClass: 'Economy',
      passengers,
      baggageInfo: flightDetails.baggage,
      seatInfo: null,
      mealPreferences: null,
      ticketNumbers: []
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking,
        flightDetails: flightBooking,
        pnr
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user bookings
exports.getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0 } = req.query;

    const bookings = await Booking.findByUserId(
      userId,
      parseInt(limit),
      parseInt(offset)
    );

    // Get flight details for each booking
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const flightDetails = await FlightBooking.findByBookingId(booking.id);
        return {
          ...booking,
          flightDetails
        };
      })
    );

    res.json({
      success: true,
      data: {
        bookings: bookingsWithDetails,
        count: bookings.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get booking by ID
exports.getBookingById = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking belongs to user
    if (booking.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const flightDetails = await FlightBooking.findByBookingId(bookingId);

    res.json({
      success: true,
      data: {
        booking,
        flightDetails
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get booking by PNR
exports.getBookingByPNR = async (req, res, next) => {
  try {
    const { pnr } = req.params;

    const booking = await Booking.findByPNR(pnr.toUpperCase());

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const flightDetails = await FlightBooking.findByBookingId(booking.id);

    res.json({
      success: true,
      data: {
        booking,
        flightDetails
      }
    });
  } catch (error) {
    next(error);
  }
};

// Cancel booking
exports.cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking belongs to user
    if (booking.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking already cancelled'
      });
    }

    // Cancel booking
    const cancelledBooking = await Booking.cancel(bookingId, reason);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        booking: cancelledBooking
      }
    });
  } catch (error) {
    next(error);
  }
};

// Confirm booking (after payment)
exports.confirmBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { paymentId } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update booking status
    const confirmedBooking = await Booking.updateStatus(bookingId, 'confirmed');

    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      data: {
        booking: confirmedBooking
      }
    });
  } catch (error) {
    next(error);
  }
};
