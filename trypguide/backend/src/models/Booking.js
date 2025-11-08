const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Booking {
  // Create new booking
  static async create(bookingData) {
    const {
      userId,
      bookingType,
      pnr,
      status,
      totalAmount,
      currency,
      travelDate,
      passengersCount,
      contactEmail,
      contactPhone,
      metadata
    } = bookingData;

    const result = await query(
      `INSERT INTO bookings (
        user_id, booking_type, pnr, status, total_amount, currency,
        booking_date, travel_date, passengers_count, contact_email, contact_phone, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        userId,
        bookingType,
        pnr,
        status,
        totalAmount,
        currency || 'INR',
        travelDate,
        passengersCount,
        contactEmail,
        contactPhone,
        JSON.stringify(metadata || {})
      ]
    );

    return result.rows[0];
  }

  // Find booking by ID
  static async findById(id) {
    const result = await query(
      'SELECT * FROM bookings WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Find booking by PNR
  static async findByPNR(pnr) {
    const result = await query(
      'SELECT * FROM bookings WHERE pnr = $1',
      [pnr]
    );
    return result.rows[0];
  }

  // Find user bookings
  static async findByUserId(userId, limit = 10, offset = 0) {
    const result = await query(
      `SELECT * FROM bookings 
       WHERE user_id = $1 
       ORDER BY booking_date DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  // Update booking status
  static async updateStatus(id, status) {
    const result = await query(
      `UPDATE bookings 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  }

  // Cancel booking
  static async cancel(id, reason) {
    const result = await query(
      `UPDATE bookings 
       SET status = 'cancelled', 
           metadata = jsonb_set(metadata, '{cancellation_reason}', $1::jsonb),
           updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [JSON.stringify(reason), id]
    );
    return result.rows[0];
  }

  // Generate unique PNR
  static generatePNR() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pnr = '';
    for (let i = 0; i < 6; i++) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pnr;
  }

  // Get booking statistics for user
  static async getUserStats(userId) {
    const result = await query(
      `SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
        SUM(total_amount) as total_spent
       FROM bookings 
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }
}

module.exports = Booking;
