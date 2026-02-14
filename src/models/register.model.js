// models/register.model.js
const { db } = require("../config/firebase.config");
const { collection, query, where, getDocs, addDoc } = require("firebase/firestore");

// Check if user exists
const findUserByEmail = async (email) => {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  };
};

// Create new user
const createUser = async (userData) => {
  const docRef = await addDoc(collection(db, "users"), userData);
  return docRef.id;
};

module.exports = {
  findUserByEmail,
  createUser,
};
