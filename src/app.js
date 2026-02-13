const express = require("express");
const applyMiddleware = require("./middleware");


require("./config/firebase.config");

const app = express();


applyMiddleware(app);


app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

module.exports = app;
