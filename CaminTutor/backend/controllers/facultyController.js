const pool = require('../db/index.js');
const facultyController = {};

facultyController.getFacultiesForUniversity = async (req, res) => {
  const { university_id } = req.query;
  if (!university_id) {
    return res.status(400).json({ msg: "university_id query parameter is required." });
  }
  try {
    const faculties = await pool.query("SELECT * FROM Faculties WHERE university_id = $1 ORDER BY name", [university_id]);
    res.json(faculties.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = facultyController;