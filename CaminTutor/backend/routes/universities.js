const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityController');

// @route   GET /api/universities
// @desc    Get all universities
// @access  Public
router.get('/', universityController.getAllUniversities);

module.exports = router;