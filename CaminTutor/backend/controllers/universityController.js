const pool = require('../db/index.js');
const universityController = {};

universityController.getAllUniversities = async (req, res) => {
  try {
    const universities = await pool.query("SELECT * FROM Universities ORDER BY name");
    res.json(universities.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = universityController;