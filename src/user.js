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

user.get("/getConfigs", async (req, res) => {
let result = await session.run(`MATCH (u:User)
                    MATCH (m:Model )
                    MATCH (i:Insurer )
                    MATCH (p:Policy )
                    MATCH (u)-[r1:DEALER_MODELS]->(m)-[r2:MODEL_INSURER]->(i)
                    -[r3:INSURER_POLICY]->(p)-[r4:PAYOUT_AMOUNT]->(a: Amount )
                    RETURN m,i,p,u,a`);

   let results = result.records[0]?.get([m,i,p,u,a]).properties;

  // console.log (result.records[0])
  return res.send({results})
});

user.post("/createConfig", async (req,res) => {
  const {user,configs} = req.body
  // console.log(req.body)
    const result = await session.run(
      `MERGE (u:User {
        _id: '${nanoid(8)}', 
        name: '${user.name}', 
        email:'${user.email}',
         city: '${user.city}',
          company: '${user.company}', 
          master: '${user.master}',
           distributor: '${user.distributor}'
         }) return u`
    );
    const id =  result.records[0].get("u").properties._id;    

    for(let i=0; i<configs.length;i++)
    {
      let result1 = await session.run(`MERGE (u:User {_id: '${id}'})
      MERGE ${configs[i].model === 'All' ? '(m:Model)' : `(m:Model {model: '${configs[i].model}'})`}
      MERGE ${configs[i].insurer === 'All' ? '(i:Insurer)' : `(i:Insurer {name: '${configs[i].insurer}'})`}
      MERGE ${configs[i].policy === 'All' ? '(p:Policy)' : `(p:Policy {name: '${configs[i].policy}'})`}
      MERGE (u)-[r1:DEALER_MODELS]->(m)-[r2:MODEL_INSURER]->(i)
      -[r3:INSURER_POLICY]->(p)-[r4:PAYOUT_AMOUNT]->(a: Amount {payout:'${configs[i].payout}',
      od:'${configs[i].od}', acpl:'${configs[i].acpl}' })
      RETURN u,r1,m,r2,i,r3,p,r4,a`)

      console.log(`MERGE (u:User {_id: '${id}'})
      MERGE ${configs[i].model === 'All' ? '(m:Model)' : `(m:Model {model: '${configs[i].model}'})`}
      MERGE ${configs[i].insurer === 'All' ? '(i:Insurer)' : `(i:Insurer {name: '${configs[i].insurer}'})`}
      MERGE ${configs[i].policy === 'All' ? '(p:Policy)' : `(p:Policy {name: '${configs[i].policy}'})`}
      MERGE (u)-[r1:DEALER_MODELS]->(m)-[r2:MODEL_INSURER]->(i)
      -[r3:INSURER_POLICY]->(p)-[r4:PAYOUT_AMOUNT]->(a: Amount {payout:'${configs[i].payout}',
      od:'${configs[i].od}', acpl:'${configs[i].acpl}' })
      RETURN u,r1,m,r2,i,r3,p,r4,a`);

      // let results = result1.records[0]?.get([u,r1,m,r2,i,r3,p,r4,a]).properties;
      console.log(results)


    }
   
  // return result.records[0]
    
    return res.send({id})
})

user.delete("/delete/:id/",  async (req,res) => {
    await session.run(`Match (u:User {_id: '${req.params.id}'}) DELETE u`);
    return res.send()
})


module.exports = user