// routes/login.routes.js
const express = require("express");
const router = express.Router();
const { login } = require("../controllers/login.controller");

// POST /login
router.post("/login", login);

module.exports = router;
