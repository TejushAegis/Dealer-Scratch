const express = require("express");
require('dotenv').config()
const neo4j = require('neo4j-driver')
const app = express();
const user  = require('./src/user.js') 
const { url, username, password, database } = process.env;
const driver = neo4j.driver(url, neo4j.auth.basic(username, password), {
  /* encrypted: 'ENCRYPTION_OFF' */
});
app.use(express.json())
app.use('/', user)


const session = driver.session({ database });


// app.get("/",async (req, res) => {
//     const result = await session.run("Match (u:User) return u");
//   const results =  result.records.map((i) => i.get("u").properties);
//   res.send({results});
// });

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;
