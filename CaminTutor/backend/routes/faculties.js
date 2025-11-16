const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');

// @route   GET /api/faculties
// @desc    Get all faculties for a specific university
// @access  Public
router.get('/', facultyController.getFacultiesForUniversity);

module.exports = router;