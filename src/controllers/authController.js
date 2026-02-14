const jwt = require('jsonwebtoken');
const db = require('../config/firebase.config');
const { admin } = require('../config/firebase.config');

// Google Sign-In backend method (register/login)
exports.googleSignIn = async (req, res) => {
  try {
    const { idToken } = req.body;

    // Validate input
    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "ID Token is required",
        error: "Missing idToken in request body"
      });
    }

    console.log('[AUTH] Verifying ID token with Firebase...');

    // Verify ID token with Firebase
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (tokenError) {
      console.error('[AUTH] Firebase token verification failed:', tokenError.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired ID Token",
        error: tokenError.message
      });
    }

    const { uid, email, email_verified, name } = decodedToken;

    console.log('[AUTH] Token verified for user:', email);

    // Validate decoded token
    if (!uid || !email) {
      return res.status(400).json({
        success: false,
        message: "Invalid token - missing uid or email"
      });
    }

    // Check if user exists in Firestore
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();

    const userData = {
      uid,
      email,
      email_verified: email_verified || false,
      name: name || email.split('@')[0],
      lastLogin: new Date().toISOString(),
    };

    let isNewUser = false;

    if (!doc.exists) {
      // Register new user
      console.log('[AUTH] New user detected, creating profile...');
      userData.createdAt = new Date().toISOString();
      isNewUser = true;
      await userRef.set(userData);
      console.log('[AUTH] User profile created:', uid);
    } else {
      // Update existing user's last login
      console.log('[AUTH] Existing user logging in, updating last login...');
      await userRef.update({
        lastLogin: userData.lastLogin,
        email_verified: email_verified || false,
      });
    }

    // Generate JWT token for app authentication
    const jwtToken = jwt.sign(
      { uid, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = {
      success: true,
      message: isNewUser ? "User registered successfully" : "User logged in successfully",
      isNewUser,
      data: {
        uid,
        email,
        name: userData.name,
        jwtToken,
        expiresIn: '7d',
      }
    };

    const statusCode = isNewUser ? 201 : 200;
    console.log(`[AUTH] Response sent with status ${statusCode}`);
    return res.status(statusCode).json(response);

  } catch (error) {
    console.error('[AUTH] Unexpected error:', error);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: process.env.NODE_ENV === 'production' ? "Internal server error" : error.message
    });
  }
};
