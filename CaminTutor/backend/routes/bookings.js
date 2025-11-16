const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (Logged-in user)
router.post('/', authMiddleware, bookingController.createBooking);

// @route   GET /api/bookings/user
// @desc    Get all bookings for the logged-in user
// @access  Private (Logged-in user)
router.get('/user', authMiddleware, bookingController.getUserBookings);

module.exports = router;