const Router = require("express")
const user = Router();
require('dotenv').config()
const neo4j = require('neo4j-driver')
const { url, username, password, database } = process.env;
const driver = neo4j.driver(url, neo4j.auth.basic(username, password), {
  /* encrypted: 'ENCRYPTION_OFF' */
});
const session = driver.session({ database });

user.get("/", async (req, res) => {
    const result = await session.run("Match (u:User) return u");
    const results =  result.records.map((i) => i.get("u").properties);
    res.send({results});
});

module.exports = user