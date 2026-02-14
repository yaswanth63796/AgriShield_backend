const cors = require("cors");
const express = require("express");

const applyMiddleware = (app) => {
  // Configure CORS for React Native and web clients
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://agrishield-backend-e9yg.onrender.com', 'https://your-frontend-url.com'] 
      : true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
};

module.exports = applyMiddleware;
