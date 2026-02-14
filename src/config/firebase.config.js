const admin = require("firebase-admin");
const path = require("path");

 // adjust path
 const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

console.log("Firebase Connected Successfully");

// Export both admin and db
module.exports = { admin, db };

