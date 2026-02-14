const express = require("express");
const applyMiddleware = require("./middleware");
require("./config/firebase.config");

const cropsRoutes = require("./routes/crops");
const registerRoutes = require("./routes/register");
const farmerRoutes = require('./routes/farmerRegisterRoutes');
const authRoutes = require('./routes/authRoutes');



const app = express();

applyMiddleware(app);

app.use("/api/crops", cropsRoutes);

app.use('/api/farmers', farmerRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('Firebase Google Sign-In Backend API Running'));


app.get("/", (req, res) => {
  res.send("Server Running");
});

module.exports = app;

