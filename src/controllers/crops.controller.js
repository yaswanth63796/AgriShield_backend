const db = require("../config/firebase.config");

const createCropReport = async (req, res) => {
  try {
    const { description, latitude, longitude } = req.body;

    const cropData = {
      imageUrl: req.file ? req.file.path : null,
      description,
      latitude: Number(latitude),
      longitude: Number(longitude),
      status: "pending",
      createdAt: new Date(),
    };

    const docRef = await db.collection("crops").add(cropData);

    res.status(201).json({
      success: true,
      id: docRef.id,
      message: "Crop report created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCropReport,
};
