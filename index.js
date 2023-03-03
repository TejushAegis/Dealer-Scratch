const express = require("express");
require('dotenv').config()

const app = express();

app.get("/", (req, res) => {
  res.send(process.env.url);
});

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;
