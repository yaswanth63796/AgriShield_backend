const admin = require('firebase-admin');

if (!process.env.FIREBASE_KEY) {
  throw new Error(
    "FIREBASE_KEY environment variable is not set. Add it in Render's Environment Variables."
  );
}

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;

