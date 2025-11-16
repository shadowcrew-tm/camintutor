const pool = require('../db/index.js');

const bookingController = {};

// POST a new booking (Logged-in User)
bookingController.createBooking = async (req, res) => {
  // Get user ID from the auth middleware
  const user_id = req.user.id; 
  const { room_id, date_from, date_to } = req.body;

  try {
    // In a real app, you'd check for date overlaps here.
    // For this guide, we'll just create the booking.
    
    // 1. Create the booking
    const newBooking = await pool.query(
      "INSERT INTO Bookings (user_id, room_id, date_from, date_to) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, room_id, date_from, date_to]
    );

    // 2. Update the room's availability (as per the guide's schema)
    await pool.query(
      "UPDATE Rooms SET availability_status = 'booked' WHERE id = $1",
      [room_id]
    );

    res.status(201).json(newBooking.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// GET all bookings for the logged-in user (Logged-in User)
bookingController.getUserBookings = async (req, res) => {
  const user_id = req.user.id;
  try {
    const bookings = await pool.query(
      "SELECT B.*, R.room_number, D.name as dorm_name FROM Bookings B " +
      "JOIN Rooms R ON B.room_id = R.id " +
      "JOIN Dorms D ON R.dorm_id = D.id " +
      "WHERE B.user_id = $1",
      [user_id]
    );
    res.json(bookings.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = bookingController;