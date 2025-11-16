const pool = require('../db/index.js');

const reviewController = {};

// GET all reviews for a dorm (Public)
reviewController.getReviewsForDorm = async (req, res) => {
  const { dorm_id } = req.query;
  if (!dorm_id) {
    return res.status(400).json({ msg: "dorm_id query parameter is required." });
  }
  try {
    const reviews = await pool.query(
      "SELECT R.*, U.email FROM Reviews R " +
      "JOIN Users U ON R.user_id = U.id " +
      "WHERE R.dorm_id = $1 ORDER BY R.created_at DESC",
      [dorm_id]
    );
    res.json(reviews.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// POST a new review (Private)
reviewController.createReview = async (req, res) => {
  const user_id = req.user.id;
  const { dorm_id, rating, comment } = req.body;

  if (!dorm_id || !rating) {
    return res.status(400).json({ msg: "dorm_id and rating are required." });
  }

  try {
    // Upsert logic: Update if review exists, else insert
    const newReview = await pool.query(
      "INSERT INTO Reviews (dorm_id, user_id, rating, comment) " +
      "VALUES ($1, $2, $3, $4) " +
      "ON CONFLICT (dorm_id, user_id) DO UPDATE " +
      "SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, created_at = CURRENT_TIMESTAMP " +
      "RETURNING *",
      [dorm_id, user_id, rating, comment]
    );

    res.status(201).json(newReview.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.code === '23503') { // Foreign key violation
        return res.status(404).json({ msg: "Dorm or user not found." });
    }
    if (err.code === '23514') { // Check constraint (e.g., rating out of 1-5)
        return res.status(400).json({ msg: "Rating must be between 1 and 5." });
    }
    res.status(500).send("Server error");
  }
};

module.exports = reviewController;