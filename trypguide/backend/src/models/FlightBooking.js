const { query } = require('../config/database');

class FlightBooking {
  // Create flight booking details
  static async create(flightData) {
    const {
      bookingId,
      airlineCode,
      flightNumber,
      fromAirport,
      toAirport,
      departureTime,
      arrivalTime,
      cabinClass,
      bookingClass,
      passengers,
      baggageInfo,
      seatInfo,
      mealPreferences,
      ticketNumbers
    } = flightData;

    const result = await query(
      `INSERT INTO flight_bookings (
        booking_id, airline_code, flight_number, from_airport, to_airport,
        departure_time, arrival_time, cabin_class, booking_class, passengers,
        baggage_info, seat_info, meal_preferences, ticket_numbers
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        bookingId,
        airlineCode,
        flightNumber,
        fromAirport,
        toAirport,
        departureTime,
        arrivalTime,
        cabinClass,
        bookingClass,
        JSON.stringify(passengers),
        JSON.stringify(baggageInfo || {}),
        JSON.stringify(seatInfo || {}),
        JSON.stringify(mealPreferences || {}),
        JSON.stringify(ticketNumbers || [])
      ]
    );

    return result.rows[0];
  }

  // Find by booking ID
  static async findByBookingId(bookingId) {
    const result = await query(
      'SELECT * FROM flight_bookings WHERE booking_id = $1',
      [bookingId]
    );
    return result.rows;
  }

  // Find by ID
  static async findById(id) {
    const result = await query(
      'SELECT * FROM flight_bookings WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Update seat information
  static async updateSeats(id, seatInfo) {
    const result = await query(
      `UPDATE flight_bookings 
       SET seat_info = $1 
       WHERE id = $2 
       RETURNING *`,
      [JSON.stringify(seatInfo), id]
    );
    return result.rows[0];
  }

  // Update meal preferences
  static async updateMeals(id, mealPreferences) {
    const result = await query(
      `UPDATE flight_bookings 
       SET meal_preferences = $1 
       WHERE id = $2 
       RETURNING *`,
      [JSON.stringify(mealPreferences), id]
    );
    return result.rows[0];
  }

  // Add ticket numbers after ticketing
  static async updateTicketNumbers(id, ticketNumbers) {
    const result = await query(
      `UPDATE flight_bookings 
       SET ticket_numbers = $1 
       WHERE id = $2 
       RETURNING *`,
      [JSON.stringify(ticketNumbers), id]
    );
    return result.rows[0];
  }

  // Get complete booking with flight details
  static async getCompleteBooking(bookingId) {
    const result = await query(
      `SELECT 
        b.*,
        json_agg(fb.*) as flight_details
       FROM bookings b
       LEFT JOIN flight_bookings fb ON b.id = fb.booking_id
       WHERE b.id = $1
       GROUP BY b.id`,
      [bookingId]
    );
    return result.rows[0];
  }
}

module.exports = FlightBooking;
