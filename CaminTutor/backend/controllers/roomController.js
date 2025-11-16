const pool = require('../db/index.js');

const roomController = {};

// GET rooms (filtered by dorm_id) (Public)
roomController.getRoomsForDorm = async (req, res) => {
  const { dorm_id } = req.query; // e.g., /api/rooms?dorm_id=...
  if (!dorm_id) {
    return res.status(400).json({ msg: "dorm_id query parameter is required." });
  }
  try {
    const rooms = await pool.query("SELECT * FROM Rooms WHERE dorm_id = $1", [dorm_id]);
    res.json(rooms.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// POST a new room (Admin Only)
roomController.createRoom = async (req, res) => {
  const { dorm_id, room_number, price, capacity } = req.body;
  try {
    const newRoom = await pool.query(
      "INSERT INTO Rooms (dorm_id, room_number, price, capacity) VALUES ($1, $2, $3, $4) RETURNING *",
      [dorm_id, room_number, price, capacity]
    );
    res.status(201).json(newRoom.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// PUT (update) a room (Admin Only)
roomController.updateRoom = async (req, res) => {
  const { id } = req.params;
  const { room_number, price, capacity, availability_status } = req.body;
  try {
    const updatedRoom = await pool.query(
      "UPDATE Rooms SET room_number = $1, price = $2, capacity = $3, availability_status = $4 WHERE id = $5 RETURNING *",
      [room_number, price, capacity, availability_status, id]
    );
    if (updatedRoom.rows.length === 0) {
      return res.status(404).json({ msg: "Room not found." });
    }
    res.json(updatedRoom.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = roomController;