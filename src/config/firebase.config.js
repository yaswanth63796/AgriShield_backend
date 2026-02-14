const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require("../../firebase_key.json"); // adjust path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

console.log("Firebase Connected Successfully");

// Export both admin and db
module.exports = { admin, db };

