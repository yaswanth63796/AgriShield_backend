const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { createCropReport } = require("../controllers/crops.controller");

router.post("/", upload.single("image"), createCropReport);

module.exports = router;
