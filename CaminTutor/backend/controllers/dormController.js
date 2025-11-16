const pool = require('../db/index.js');

const dormController = {};

// GET all dorms (Public)
// Can be filtered by faculty_id
dormController.getAllDorms = async (req, res) => {
  const { faculty_id } = req.query;
  
  try {
    let query;
    let queryParams = [];

    // Base query to get dorms and count available places
    // An available place is a spot in a room (capacity) where the room is 'available'
    const baseQuery = `
      SELECT 
        D.*, 
        COALESCE(SUM(R.capacity), 0) AS available_places_count
      FROM Dorms D
      LEFT JOIN Rooms R ON D.id = R.dorm_id AND R.availability_status = 'available'
    `;

    if (faculty_id) {
      // If filtering by faculty, join with Dorm_Faculties
      query = `
        ${baseQuery}
        JOIN Dorm_Faculties DF ON D.id = DF.dorm_id
        WHERE DF.faculty_id = $1
        GROUP BY D.id
        ORDER BY D.name
      `;
      queryParams.push(faculty_id);
    } else {
      // Otherwise, get all dorms
      query = `
        ${baseQuery}
        GROUP BY D.id
        ORDER BY D.name
      `;
    }

    const dorms = await pool.query(query, queryParams);
    res.json(dorms.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// GET a single dorm by ID (Public)
dormController.getDormById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Get Dorm details
    const dormRes = await pool.query("SELECT * FROM Dorms WHERE id = $1", [id]);
    if (dormRes.rows.length === 0) {
      return res.status(404).json({ msg: "Dorm not found." });
    }
    const dorm = dormRes.rows[0];

    // 2. Get associated faculties
    const facultiesRes = await pool.query(
      "SELECT F.id, F.name FROM Faculties F " +
      "JOIN Dorm_Faculties DF ON F.id = DF.faculty_id " +
      "WHERE DF.dorm_id = $1",
      [id]
    );
    dorm.faculties = facultiesRes.rows;

    // 3. Get associated reviews
    const reviewsRes = await pool.query(
      "SELECT R.*, U.email FROM Reviews R " +
      "JOIN Users U ON R.user_id = U.id " +
      "WHERE R.dorm_id = $1 ORDER BY R.created_at DESC",
      [id]
    );
    dorm.reviews = reviewsRes.rows;

    res.json(dorm);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// POST a new dorm (Admin Only)
dormController.createDorm = async (req, res) => {
  // pictures is an array of URLs, tips is a string
  const { name, address, description, pictures, tips } = req.body;
  try {
    const newDorm = await pool.query(
      "INSERT INTO Dorms (name, address, description, pictures, tips) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, address, description, pictures, tips]
    );
    res.status(201).json(newDorm.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// PUT (update) a dorm (Admin Only)
dormController.updateDorm = async (req, res) => {
  const { id } = req.params;
  const { name, address, description, pictures, tips } = req.body;
  try {
    const updatedDorm = await pool.query(
      "UPDATE Dorms SET name = $1, address = $2, description = $3, pictures = $4, tips = $5 WHERE id = $6 RETURNING *",
      [name, address, description, pictures, tips, id]
    );
    if (updatedDorm.rows.length === 0) {
      return res.status(404).json({ msg: "Dorm not found." });
    }
    res.json(updatedDorm.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = dormController;