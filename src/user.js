const Router = require("express")
const user = Router();

user.get("/", async (req, res) => {
    const result = await session.run("Match (u:User) return u");
    const results =  result.records.map((i) => i.get("u").properties);
    res.send({results});
});

module.exports = user