const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // 1. Get the token from the request header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format is "Bearer TOKEN"

  // 2. Check if token exists
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied." });
  }

  // 3. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Add the user payload (e.g., id, role) to the request object
    req.user = decoded.user;
    next(); // Move on to the next middleware or the route handler
  } catch (err) {
    res.status(403).json({ msg: "Token is not valid." });
  }
}

module.exports = authMiddleware;