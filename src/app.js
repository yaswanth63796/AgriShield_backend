const express = require("express");
const applyMiddleware = require("./middleware");
require("./config/firebase.config");

const cropsRoutes = require("./routes/crops");
const registerRoutes = require("./routes/register");
const farmerRoutes = require('./routes/farmerRegisterRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

applyMiddleware(app);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'AgriShield Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'AgriShield Backend API',
    version: '1.0.0',
    description: 'Firebase Google Sign-In Backend API',
    endpoints: {
      health: '/health',
      auth: '/api/auth/google',
      crops: '/api/crops',
      farmers: '/api/farmers'
    }
  });
});

// Routes
app.use("/api/crops", cropsRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? undefined : err
  });
});

module.exports = app;

