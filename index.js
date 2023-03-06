const express = require("express");
require('dotenv').config()
const app = express();
const user  = require('./src/user.js') 

app.use(express.json())
app.use('/', user)


app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;
