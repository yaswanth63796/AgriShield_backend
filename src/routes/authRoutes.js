const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/google → verify token, register/login
router.post('/google', authController.googleSignIn);

module.exports = router;
