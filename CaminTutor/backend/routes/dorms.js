const express = require('express');
const router = express.Router();
const dormController = require('../controllers/dormController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// @route   GET /api/dorms
// @desc    Get all dorms (can filter by faculty_id)
// @access  Public
router.get('/', dormController.getAllDorms);

// @route   GET /api/dorms/:id
// @desc    Get one dorm by ID (with faculties and reviews)
// @access  Public
router.get('/:id', dormController.getDormById);

// @route   POST /api/dorms
// @desc    Create a new dorm
// @access  Admin Only
router.post('/', [authMiddleware, adminMiddleware], dormController.createDorm);

// @route   PUT /api/dorms/:id
// @desc    Update a dorm
// @access  Admin Only
router.put('/:id', [authMiddleware, adminMiddleware], dormController.updateDorm);

module.exports = router;