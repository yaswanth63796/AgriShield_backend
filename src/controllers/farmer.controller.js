const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createFarmer,
  getFarmerByEmail,
} = require("../models/farmer.model");

const registerFarmer = async (req, res) => {
  try {
    const { farmerName, email, password, bankName, bankRegion } = req.body;

    // Validation
    if (!farmerName || !email || !password || !bankName || !bankRegion) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing email
    const existingFarmer = await getFarmerByEmail(email);
    if (existingFarmer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const farmerData = {
      farmerName,
      email,
      password: hashedPassword,
      bankName,
      bankRegion,
      role: "farmer",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const farmerId = await createFarmer(farmerData);

    res.status(201).json({
      message: "Farmer registered successfully",
      
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerFarmer,
};
