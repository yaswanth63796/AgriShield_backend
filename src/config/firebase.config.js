import admin from "firebase-admin";

if (!process.env.FIREBASE_KEY) {
  throw new Error("FIREBASE_KEY environment variable not set!");
}

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
