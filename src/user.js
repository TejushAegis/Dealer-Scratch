const router = require('express');
const user = router();
require('dotenv').config();
const neo4j = require('neo4j-driver');
const nanoid = require('nanoid');
const { url, username, password, database } = process.env;
const driver = neo4j.driver(url, neo4j.auth.basic(username, password), {
  /* encrypted: 'ENCRYPTION_OFF' */
});
const session = driver.session({ database });

const createUser = async function(user) {
  // const {user,configs} = req.body
  let id = null;
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
    id =  result.records[0].get('u').properties._id;    
  }
  else
    id =  check.records[0].get('u').properties._id;    

  return id;
};

// user.get("/getConfigsx/:id", async (req, res) => {
// let result = await session.run(`MATCH (u:User  {_id: '${req.params.id}'})
//                     MATCH (c:Category)
//                     MATCH (m:Model )
//                     MATCH (i:Insurer )
//                     MATCH (p:Policy )
//                     MATCH (a:Amount )
//                     MATCH (u)-[r1:USER_INSURER]->(i)-[r2:INSURER_POLICY]->(p)-[r3:POLICY_CATEGORY]->(c)
//                     -[r4:CATEGORY_MODEL]->(m)-[r5:AMOUNT]->(a)
//                     RETURN m,i,p,u,a,c`);

// let nodes = result.records.map(record => {
//   let tempam = record.get("a").properties
//   return {
//     category: record.get("c").properties.name,
//     model: record.get("m").properties.name,
//     insurer: record.get("i").properties.name,
//     policy: record.get("p").properties.name,
//     user: record.get("u").properties.name,
//     od: tempam.od,
//     payout: tempam.payout,
//     acpl: tempam.acpl
//   };
// });
                    
//   // console.log (result.records[0])
//   return res.send(result)
// });

// user.post("/createConfig", async (req,res) => {
//   const {user,configs} = req.body
//   let id = null
//   // console.log(req.body)
//           // _id: '${nanoid(8)}', 
//     const check = await session.run(
//       `MATCH (u:User {
//         name: '${user.name}', 
//         email:'${user.email}',
//          city: '${user.city}',
//           company: '${user.company}', 
//           master: '${user.master}',
//            distributor: '${user.distributor}'
//          }) return u`
//     );
//     if(!check.records.length)
//     {
//       const result = await session.run(
//         `CREATE (u:User {
//           name: '${user.name}', 
//           _id: '${nanoid(8)}',
//           email:'${user.email}',
//            city: '${user.city}',
//             company: '${user.company}', 
//             master: '${user.master}',
//              distributor: '${user.distributor}'
//            }) return u`
//       );
//       id =  result.records[0].get("u").properties._id;    
//     }
//     else
//      id =  check.records[0].get("u").properties._id;    

//     for(let i=0; i<configs.length;i++)
//     {
//       let result1 = await session.run(`MERGE (u:User {_id: '${id}'})
//       MERGE ${configs[i].category === 'All' ? '(c:Category)' : `(c:Category {name: '${configs[i].category}'})`}
//       MERGE ${configs[i].model === 'All' ? '(m:Model)' : `(m:Model {name: '${configs[i].model}'})`}
//       MERGE ${configs[i].insurer === 'All' ? '(i:Insurer)' : `(i:Insurer {name: '${configs[i].insurer}'})`}
//       MERGE ${configs[i].policy === 'All' ? '(p:Policy)' : `(p:Policy {name: '${configs[i].policy}'})`}
//       MERGE (a: Amount {payout:'${configs[i].payout}',
//       od:'${configs[i].od}', acpl:'${configs[i].acpl}' })
//       MERGE (u)-[r1:DEALER_CATEGORY]-> (c)
//       MERGE (c)-[r2:CATEGORY_MODEL] -> (m)
//       MERGE (m)-[r3:MODEL_INSURER]->(i)
//       MERGE (i)-[r4:INSURER_POLICY]->(p)
//       MERGE (p)-[r5:POLICY_AMOUNT]->(a)
//       RETURN u,r1,c,r2, m,r3,i,r4,p,r5,a`)

//       let results = result1.records[0]
//     }
//     return res.send()
// })
// user.post("/createConfig", async (req,res) => {

//   // await session.run(`MATCH (n)
//   // OPTIONAL MATCH (n)-[r]-()
//   // DELETE n,r
//   // `);

//   const {user,configs} = req.body

//   const id =  await createUser(user)   
 
//   for (let i = 0; i < configs.length; i++) {

//     let query = `MERGE (u:User {_id: '${id}'})`;
//     const { category, model, insurer, policy, payout, od, acpl } = configs[i];

//     block : {
//       if (insurer !== 'All') {
//         query += `\nMERGE (i:Insurer {name: '${insurer}'})
//         MERGE (u)-[r1:USER_INSURER]->(i)`;
//       } else {
//         query += `\nMERGE (a: Amount {payout:'${payout}', od:'${od}', acpl:'${acpl}' })
//         MERGE (u)-[r1:AMOUNT]->(a)`;
//         break block;
//       }
      
//       if (policy !== 'All') {
//         query += `\nMERGE (p:Policy {name: '${policy}'})
//         MERGE (i)-[r2:INSURER_POLICY]->(p)`;
//       } else {
//         query += `\nMERGE (a: Amount {payout:'${payout}', od:'${od}', acpl:'${acpl}' })
//         MERGE (i)-[r2:AMOUNT]->(a)`;
//         break block;
//       }

//       if (category !== 'All') {
//         query += `\nMERGE (c:Category {name: '${category}'})
//         MERGE (p)-[r3:POLICY_CATEGORY]-> (c)`;
//       } else {
//         query += `\nMERGE (a: Amount {payout:'${payout}', od:'${od}', acpl:'${acpl}' })
//         MERGE (p)-[r3:AMOUNT]->(a)`;
//         break block;
//       }
      
//       if (model !== 'All') {
//         query += `\nMERGE (m:Model {name: '${model}'})
//         MERGE (c)-[r4:CATEGORY_MODEL] -> (m)`;
//       } else {
//         query += `\nMERGE (a: Amount {payout:'${payout}', od:'${od}', acpl:'${acpl}' })
//         MERGE (c)-[r4:AMOUNT]->(a)`;
//         break block;
//       }

//       query += `\nMERGE (a: Amount {payout:'${payout}', od:'${od}', acpl:'${acpl}' })
//         MERGE (m)-[r5:AMOUNT]->(a)`;
//         break block;

//     }
//     // console.log(query); // Output the generated query for debugging purposes
  
//   // Use a Neo4j driver to execute the generated query
//     const create = await session.run(query);
//     // console.log(create);

//   }

//   return res.send()
  
// })

user.delete('/deleteByName/:type/:name',  async (req,res) => {
  await session.run(`MATCH (i:'${req.params.type}' {name:'${req.params.name}'})-[r]-() DELETE r`);
  await session.run(`MATCH (i:'${req.params.type}' {name:'${req.params.name}'}) DELETE i`);
  return res.send();
});

user.delete('/deleteEvery/',  async (req,res) => {
  await session.run(`MATCH (n)
  OPTIONAL MATCH (n)-[r]-()
  DELETE n,r
  `);
  return res.send();
});

user.get('/getConfigs/:id', async (req,res) => {

  let result = await session.run(
    ` MATCH path = (n:User)-[r*]->(a:Amount)
  WHERE n._id = '${req.params.id}'
  RETURN path
 `);

  let nodes = result.records.map((record) => {

    //getting segment of each record
    let seg =  record._fields[0].segments;

    //getting start of each segment
    let out = seg.map( (records) => ({[records.start.labels]:records.start.properties.name}));

    //converting array to object and adding amounts
    let obj = Object.assign({}, ...out);
    let obj2 = Object.assign(obj,record._fields[0].end.properties);

    return obj2;
  });

  res.send(nodes);

});

user.post('/singleConfig', async (req,res) => {

  const {insurer, dealer, model, policy, category } = req.body.config;
  let query = `OPTIONAL MATCH (u:User {_id: '${dealer}'})`;

  let pass = [1,'u','USER'];
  // block : {

  if(insurer!=='All')
  {
    query+= `\nOPTIONAL MATCH (i:Insurer {name: '${insurer}'})
        OPTIONAL MATCH (${pass[1]})-[r${pass[0]}:${pass[2]}_INSURER]->(i)
        `;
        
    pass=[++pass[0],'i','INSURER'];
  }
  if(policy!=='All')
  {
    query+= `\nOPTIONAL MATCH (p:Policy {name: '${policy}'})
        OPTIONAL MATCH (${pass[1]})-[r${pass[0]}:${pass[2]}_POLICY]->(p)
        `;
    pass=[++pass[0],'p','POLICY'];
  }
  if(category!=='All')
  {
    query+= `\nOPTIONAL MATCH (c:Category {name: '${category}'})
        OPTIONAL MATCH (${pass[1]})-[r${pass[0]}:${pass[2]}_CATEGORY]->(c)
        `;
    pass=[++pass[0],'c','CATEGORY'];
  }
  if(model!=='All')
  {
    query+= `\nOPTIONAL MATCH (m:Model {name: '${model}'})
        OPTIONAL MATCH (${pass[1]})-[r${pass[0]}:${pass[2]}_MODEL]->(m)
        `;
    pass=[++pass[0],'m','MODEL'];
  }

  query += `\nOPTIONAL MATCH (${pass[1]})-[r${pass[0]}:${pass[2]}_AMOUNT]->(a:Amount)
      
      return a`;

  // }

  console.log(query);
  const result = await session.run(query);
  let out = result.records[0].get('a');
  return res.send(out.properties);

});

user.post('/sparseConfig', async (req,res) => {

  const {user,configs} = req.body;

  const id =  await createUser(user);   
 
  for (let i = 0; i < configs.length; i++) {

    let query = `MERGE (u:User {_id: '${id}'})`;
    const { category, model, insurer, policy, payout, od, acpl } = configs[i];
    let pass = [1,'u','USER'];
    // block : {

    if(insurer!=='All')
    {
      query+= `\nMERGE (i:Insurer {name: '${insurer}'})
        MERGE (${pass[1]})-[r${pass[0]}:${pass[2]}_INSURER]->(i)
        `;
        
      pass=[++pass[0],'i','INSURER'];
    }
    if(policy!=='All')
    {
      query+= `\nMERGE (p:Policy {name: '${policy}'})
        MERGE (${pass[1]})-[r${pass[0]}:${pass[2]}_POLICY]->(p)
        `;
      pass=[++pass[0],'p','POLICY'];
    }
    if(category!=='All')
    {
      query+= `\nMERGE (c:Category {name: '${category}'})
        MERGE (${pass[1]})-[r${pass[0]}:${pass[2]}_CATEGORY]->(c)
        `;
      pass=[++pass[0],'c','CATEGORY'];
    }
    if(model!=='All')
    {
      query+= `\nMERGE (m:Model {name: '${model}'})
        MERGE (${pass[1]})-[r${pass[0]}:${pass[2]}_MODEL]->(m)
        `;
      pass=[++pass[0],'m','MODEL'];
    }

    query += `\nMERGE (a: Amount {payout:'${payout}', od:'${od}', acpl:'${acpl}' })
      MERGE (${pass[1]})-[r${pass[0]}:${pass[2]}_AMOUNT]->(a)`;

    // }

    console.log(query);
    const create = await session.run(query);
    return res.send(create);

  }

});



module.exports = user;