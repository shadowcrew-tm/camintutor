const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/reviews
// @desc    Get all reviews for a specific dorm
// @access  Public
router.get('/', reviewController.getReviewsForDorm);

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private (Logged-in user)
router.post('/', authMiddleware, reviewController.createReview);

module.exports = router;