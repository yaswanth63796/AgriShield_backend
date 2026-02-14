const db = require('../config/firebase.config');
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


exports.addFarmerCrop = async (req, res) => {
  try {
    // Extract from request body
    let { cropName, acreage, landUnit, sowingDate, season, latitude, longitude } = req.body;

    // If latitude or longitude not provided, set default (0,0) or handle differently
    latitude = latitude || 0;
    longitude = longitude || 0;

    // Validate required fields
    if (!cropName || !acreage || !landUnit || !sowingDate || !season) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Create new crop object using the model
    const newCrop = FarmerCropModel({ cropName, acreage, landUnit, sowingDate, season, latitude, longitude });

    // Save to Firebase
    const docRef = await db.collection(collectionName).add(newCrop);

    res.status(201).json({ id: docRef.id, ...newCrop });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all farmer crops
exports.getFarmerCrops = async (req, res) => {
  try {
    const snapshot = await db.collection(collectionName).get();
    const crops = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(crops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single crop by ID
exports.getFarmerCropById = async (req, res) => {
  try {
    const doc = await db.collection(collectionName).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: "Crop not found" });
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 