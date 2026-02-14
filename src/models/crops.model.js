const db = require("../config/firebase.config");


const CropSchema = {
  imageUrl: String,        
  description: String,     
  latitude: Number,        
  longitude: Number,       
  status: String,          
  createdAt: Date,         
};

// Create Crop Report
const createCrop = async (data) => {
  const cropData = {
    imageUrl: data.imageUrl,               // String
    description: data.description,         // String
      
    status: data.status || "pending",      // Default value
    createdAt: new Date(),                 // Date
  };

  const docRef = await db.collection("crops").add(cropData);
  return docRef.id;
};

module.exports = {
  CropSchema,
  createCrop,
};

