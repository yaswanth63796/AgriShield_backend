const admin = require("firebase-admin");
const path = require("path");


const serviceAccount = require(path.join(
  __dirname,
  "../../geotechdatabase-a6a85-firebase-adminsdk-fbsvc-f5338ee348.json"
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

console.log("🔥 Firebase Connected Successfully");

module.exports = db;

