// controllers/farmerCrop.controller.js
const { db } = require('../config/firebase.config');
const { collection, addDoc, getDocs, doc, getDoc } = require('firebase/firestore');

const collectionName = 'farmerCrops';

const FarmerCropModel = ({ cropName, acreage, landUnit, sowingDate, season, latitude, longitude }) => ({
  cropName,
  acreage,
  landUnit,
  sowingDate,
  season,
  latitude,
  longitude,
  createdAt: new Date().toISOString(),
});

// Add a new farmer crop
exports.addFarmerCrop = async (req, res) => {
  try {
    let { cropName, acreage, landUnit, sowingDate, season, latitude, longitude } = req.body;

    latitude = latitude || 0;
    longitude = longitude || 0;

    if (!cropName || !acreage || !landUnit || !sowingDate || !season) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const newCrop = FarmerCropModel({ cropName, acreage, landUnit, sowingDate, season, latitude, longitude });

    // Save to Firestore
    const docRef = await addDoc(collection(db, collectionName), newCrop);

    res.status(201).json({ id: docRef.id, ...newCrop });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all farmer crops
exports.getFarmerCrops = async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    const crops = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(crops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single crop by ID
exports.getFarmerCropById = async (req, res) => {
  try {
    const docRef = doc(db, collectionName, req.params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return res.status(404).json({ message: "Crop not found" });

    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
