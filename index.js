const express = require("express");
require('dotenv').config()
const neo4j = require('neo4j-driver')
const app = express();
const { url, username, password, database } = process.env;
const driver = neo4j.driver(url, neo4j.auth.basic(username, password), {
  /* encrypted: 'ENCRYPTION_OFF' */
});

const session = driver.session({ database });


app.get("/", (req, res) => {
  res.send(url,username);
});

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;
