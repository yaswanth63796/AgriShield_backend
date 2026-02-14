const db = require('../config/firebase.config');
const { admin } = require('../config/firebase.config');

// Google Sign-In backend method (register/login)
exports.googleSignIn = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) return res.status(400).json({ message: "ID Token is required" });

    // Verify ID token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists in Firestore
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      // Register new user
      await userRef.set({
        uid,
        email,
        name,
        picture,
        createdAt: new Date().toISOString(),
      });
      return res.status(201).json({ message: "User registered successfully", uid, email, name, picture });
    }

    // Existing user → login
    return res.status(200).json({ message: "User logged in successfully", uid, email, name, picture });

  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid ID Token", error: error.message });
  }
};
