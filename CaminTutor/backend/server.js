require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Import 'path'

// Import routes
const authRoutes = require('./routes/auth');
const dormRoutes = require('./routes/dorms');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const universityRoutes = require('./routes/universities'); // NEW
const facultyRoutes = require('./routes/faculties'); // NEW
const reviewRoutes = require('./routes/reviews'); // NEW

// Initialize app
const app = express();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing
app.use(cors()); 
// Enable express to parse JSON bodies from POST/PUT requests
app.use(express.json()); 

// --- API Routes ---
// Group all API routes together
app.get('/api/health', (req, res) => {
  res.send('API is running...');
});
app.use('/api/auth', authRoutes);
app.use('/api/dorms', dormRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/universities', universityRoutes); // NEW
app.use('/api/faculties', facultyRoutes); // NEW
app.use('/api/reviews', reviewRoutes); // NEW

// --- SERVE REACT APP (Production) ---
// 1. Serve static files (like CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// 2. For any GET request that doesn't start with /api, send the React app's 'index.html'
// This must be AFTER your API routes.
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});