const Router = require("express")
const user = Router();
require('dotenv').config()
const neo4j = require('neo4j-driver')
const nanoid = require('nanoid')
const { url, username, password, database } = process.env;
const driver = neo4j.driver(url, neo4j.auth.basic(username, password), {
  /* encrypted: 'ENCRYPTION_OFF' */
});
const session = driver.session({ database });

user.get("/", async (req, res) => {
    const result = await session.run("Match (u:User) return u");
    const results =  result.records.map((i) => i.get("u").properties);
    return res.send({results});
});

user.get("/getConfigs/:id", async (req, res) => {
let result = await session.run(`MATCH (u:User  {_id: '${id}'})
                    MATCH (m:Model )
                    MATCH (i:Insurer )
                    MATCH (p:Policy )
                    MATCH (u)-[r1:DEALER_MODELS]->(m)-[r2:MODEL_INSURER]->(i)
                    -[r3:INSURER_POLICY]->(p)-[r4:PAYOUT_AMOUNT]->(a: Amount )
                    RETURN m,i,p,u,a`);

   let results = result;

  // console.log (result.records[0])
  return res.send(results)
});

user.post("/createConfig", async (req,res) => {
  const {user,configs} = req.body
  let id = null
  // console.log(req.body)
          // _id: '${nanoid(8)}', 
    const check = await session.run(
      `MATCH (u:User {
        name: '${user.name}', 
        email:'${user.email}',
         city: '${user.city}',
          company: '${user.company}', 
          master: '${user.master}',
           distributor: '${user.distributor}'
         }) return u`
    );
    if(!check.records.length)
    {
      const result = await session.run(
        `CREATE (u:User {
          name: '${user.name}', 
          _id: '${nanoid(8)}',
          email:'${user.email}',
           city: '${user.city}',
            company: '${user.company}', 
            master: '${user.master}',
             distributor: '${user.distributor}'
           }) return u`
      );
      id =  result.records[0].get("u").properties._id;    
    }
    else
     id =  check.records[0].get("u").properties._id;    

    for(let i=0; i<configs.length;i++)
    {
      let result1 = await session.run(`MERGE (u:User {_id: '${id}'})
      MERGE ${configs[i].model === 'All' ? '(m:Model)' : `(m:Model {model: '${configs[i].model}'})`}
      MERGE ${configs[i].insurer === 'All' ? '(i:Insurer)' : `(i:Insurer {name: '${configs[i].insurer}'})`}
      MERGE ${configs[i].policy === 'All' ? '(p:Policy)' : `(p:Policy {name: '${configs[i].policy}'})`}
      MERGE (a: Amount {payout:'${configs[i].payout}',
      od:'${configs[i].od}', acpl:'${configs[i].acpl}' })
      MERGE (u)-[r1:DEALER_MODELS]->(m)
      MERGE (m)-[r2:MODEL_INSURER]->(i)
      MERGE (i)-[r3:INSURER_POLICY]->(p)
      MERGE (p)-[r4:PAYOUT_AMOUNT]->(a)
      RETURN u,r1,m,r2,i,r3,p,r4,a`)

      console.log(`MERGE (u:User {_id: '${id}'})
      MERGE ${configs[i].model === 'All' ? '(m:Model)' : `(m:Model {model: '${configs[i].model}'})`}
      MERGE ${configs[i].insurer === 'All' ? '(i:Insurer)' : `(i:Insurer {name: '${configs[i].insurer}'})`}
      MERGE ${configs[i].policy === 'All' ? '(p:Policy)' : `(p:Policy {name: '${configs[i].policy}'})`}
      MERGE (a: Amount {payout:'${configs[i].payout}',
      od:'${configs[i].od}', acpl:'${configs[i].acpl}' })
      MERGE (u)-[r1:DEALER_MODELS]->(m)
      MERGE (m)-[r2:MODEL_INSURER]->(i)
      MERGE (i)-[r3:INSURER_POLICY]->(p)
      MERGE (p)-[r4:PAYOUT_AMOUNT]->(a)
      RETURN u,r1,m,r2,i,r3,p,r4,a`);

      let results = result1.records[0]
      // ?.get([u,r1,m,r2,i,r3,p,r4,a]).properties;
    }
    return res.send()
})

user.delete("/delete/:id/",  async (req,res) => {
    await session.run(`Match (u:User {_id: '${req.params.id}'}) DELETE u`);
    return res.send()
})

user.get("/all_models", async (req,res) => {
    let result = await session.run(`MATCH (m:Model) return m`)
    return res.send(result.records)

})

user.delete("/deleteModel/:model/",  async (req,res) => {
  await session.run(`MATCH (m:Model {model: '${req.params.model}'})-[r]-() DELETE r`);
  await session.run(`MATCH (m:Model {model: '${req.params.model}'}) DELETE m`);
  return res.send()
})

user.delete("/deleteAmount/",  async (req,res) => {
  await session.run(`MATCH (a:Amount)-[r]-() DELETE r`);
  await session.run(`MATCH (a:Amount) DELETE a`);
  return res.send()
})

user.delete("/deletePolicy/",  async (req,res) => {
  await session.run(`MATCH (p:Policy)-[r]-() DELETE r`);
  await session.run(`MATCH (p:Policy) DELETE p`);
  return res.send()
})

user.delete("/deleteUserName/:name",  async (req,res) => {
  await session.run(`MATCH (u:User {name:'${req.params.name}'})-[r]-() DELETE r`);
  await session.run(`MATCH (u:User {name:'${req.params.name}'}) DELETE u`);
  return res.send()
})

user.delete("/deleteInsurer/:name",  async (req,res) => {
  await session.run(`MATCH (i:Insurer {name:'${req.params.name}'})-[r]-() DELETE r`);
  await session.run(`MATCH (i:Insurer {name:'${req.params.name}'}) DELETE i`);
  return res.send()
})

user.delete("/deleteEvery/",  async (req,res) => {
  await session.run(`MATCH (n)
  OPTIONAL MATCH (n)-[r]-()
  DELETE n,r
  `);
  return res.send()
})

module.exports = user