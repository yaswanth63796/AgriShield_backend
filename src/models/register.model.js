// models/register.model.js
const { db } = require("../config/firebase.config");

// Check if user exists
const findUserByEmail = async (email) => {
  const snapshot = await db.collection("users").where("email", "==", email).get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  };
};

// Create new user
const createUser = async (userData) => {
  const docRef = await db.collection("users").add(userData);
  return docRef.id;
};

module.exports = {
  findUserByEmail,
  createUser,
};
