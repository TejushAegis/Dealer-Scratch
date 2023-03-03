// Add Express
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import neo4j from "neo4j-driver";

const { url, username, password, database } = process.env;

const driver = neo4j.driver(url, neo4j.auth.basic(username, password), {
    /* encrypted: 'ENCRYPTION_OFF' */
  });
  
  const session = driver.session({ database });
  
// Initialize Express
const app = express();

// Create GET request

app.get("/", async (req, res) => {
    const result = await session.run("Match (u:User) return u");
  let results =  result.records.map((i) => i.get("u").properties);
  res.send(url);
});

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
export default app;