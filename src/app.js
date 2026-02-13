const express = require("express");
const applyMiddleware = require("./middleware");
require("./config/firebase.config");

const cropsRoutes = require("./routes/crops");
const farmerRoutes = require("./routes/farmer.routes");

const app = express();

applyMiddleware(app);

app.use("/api/crops", cropsRoutes);
app.use("/api/farmers", farmerRoutes);

app.get("/", (req, res) => {
  res.send("Server Running");
});

module.exports = app;

