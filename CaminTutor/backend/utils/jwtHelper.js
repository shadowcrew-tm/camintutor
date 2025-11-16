const jwt = require("jsonwebtoken");

function generateToken(userPayload) {
  // userPayload should be an object, e.g., { id: user.id, role: user.role }
  return jwt.sign(
    { user: userPayload },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Token expires in 1 hour
  );
}

module.exports = { generateToken };