const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// @route   GET /api/rooms
// @desc    Get all rooms for a specific dorm
// @access  Public
router.get('/', roomController.getRoomsForDorm);

// @route   POST /api/rooms
// @desc    Create a new room
// @access  Admin Only
router.post('/', [authMiddleware, adminMiddleware], roomController.createRoom);

// @route   PUT /api/rooms/:id
// @desc    Update a room
// @access  Admin Only
router.put('/:id', [authMiddleware, adminMiddleware], roomController.updateRoom);

module.exports = router;