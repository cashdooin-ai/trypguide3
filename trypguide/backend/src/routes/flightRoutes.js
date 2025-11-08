const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const { optionalAuth } = require('../middleware/auth');

// Routes
router.get('/search', optionalAuth, flightController.searchFlights);
router.post('/filter', flightController.filterFlights);
router.get('/airports', flightController.getAirports);
router.get('/:flightId', flightController.getFlightDetails);

module.exports = router;
