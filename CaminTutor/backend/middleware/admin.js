function adminMiddleware(req, res, next) {
  // This middleware should run *after* the authMiddleware.
  // We check the req.user object that authMiddleware attached.
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed to the route handler
  } else {
    res.status(403).json({ msg: "Access denied. Admin role required." });
  }
}

module.exports = adminMiddleware;