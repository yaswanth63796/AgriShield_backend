const db = require("../config/firebase.config");

const createFarmer = async (farmerData) => {
  const docRef = await db.collection("farmers").add(farmerData);
  return docRef.id;
};

const getFarmerByEmail = async (email) => {
  const snapshot = await db
    .collection("farmers")
    .where("email", "==", email)
    .get();

  if (snapshot.empty) return null;

  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

module.exports = {
  createFarmer,
  getFarmerByEmail,
};
