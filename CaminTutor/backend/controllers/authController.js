const pool = require('../db/index.js');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwtHelper.js');

const authController = {};

authController.register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ msg: "User already exists." });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Insert new user into DB
    // Use 'student' as default role if none is provided
    const userRole = role || 'student'; 
    const newUser = await pool.query(
      "INSERT INTO Users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, role",
      [email, password_hash, userRole]
    );

    // 4. Generate a token
    const tokenPayload = { 
      id: newUser.rows[0].id, 
      role: newUser.rows[0].role 
    };
    const token = generateToken(tokenPayload);

    // 5. Send token back
    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

authController.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // 3. Generate token
    const tokenPayload = { 
      id: user.rows[0].id, 
      role: user.rows[0].role 
    };
    const token = generateToken(tokenPayload);

    // 4. Send token back
    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = authController;