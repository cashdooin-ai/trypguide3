const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validator');

// Validation rules
const createBookingValidation = [
  body('flightDetails').notEmpty().withMessage('Flight details are required'),
  body('passengers').isArray({ min: 1 }).withMessage('At least one passenger is required'),
  body('contactInfo.email').isEmail().withMessage('Valid email is required'),
  body('contactInfo.phone').matches(/^[0-9]{10}$/).withMessage('Valid phone number is required')
];

// Routes - All booking routes require authentication
router.post('/', authMiddleware, createBookingValidation, validate, bookingController.createBooking);
router.get('/', authMiddleware, bookingController.getUserBookings);
router.get('/pnr/:pnr', bookingController.getBookingByPNR);
router.get('/:bookingId', authMiddleware, bookingController.getBookingById);
router.post('/:bookingId/confirm', authMiddleware, bookingController.confirmBooking);
router.post('/:bookingId/cancel', authMiddleware, bookingController.cancelBooking);

module.exports = router;
