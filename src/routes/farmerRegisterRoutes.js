const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerRegisterController');

router.post('/add', farmerController.addFarmerCrop);       // Add crop
router.get('/', farmerController.getFarmerCrops);          // Get all crops
router.get('/:id', farmerController.getFarmerCropById);    // Get crop by ID

module.exports = router;