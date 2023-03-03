import dotenv from "dotenv";
dotenv.config();
import neo4j from "neo4j-driver";

const { url, username, password, database } = process.env;
import { nanoid } from "nanoid";
const driver = neo4j.driver(url, neo4j.auth.basic(username, password), {
  /* encrypted: 'ENCRYPTION_OFF' */
});

const session = driver.session({ database });

const findAll = async () => {
  const result = await session.run("Match (u:User) return u");
  return result.records.map((i) => i.get("u").properties);
};

const findById = async (id) => {
  const result = await session.run(
    `Match (u:User {_id: '${id}' }) return u limit 1`
  );
  return result.records[0].get("u").properties;
};
const create = async (user) => {
  const result = await session.run(
    `Create (u:User {_id: '${nanoid(8)}', name: '${user.name}', email:'${
      user.email
    }', password: '${user.password}' }) return u`
  );
  return result.records[0].get("u").properties;
};
const findByIdAndUpdate = async (id, user) => {
  const result = await session.run(
    `Match (u:User {_id: '${id}'}) SET u.name='${user.name}', u.email='${user.email}', u.password= '${user.password}' }) return u`
  );
  return result.records[0].get("u").properties;
};
const findByIdAndDelete = async (id) => {
  await session.run(`Match (u:User {_id: '${id}'}) DELETE u`);
  return await findAll();
};
//n1,n2 will have id and type in object
//n1:{_id:asdasd, type: User}
//r1 will have type
const createRelationship = async (n1, n2, r1) => {
  const result = await session.run(`MATCH (j:${n1.type}{_id: '${n1._id}'})
                    MATCH (m:${n2.type}{_id: '${n2._id}'})
                    MERGE (j)-[r:${r1.type}]->(m)
                    RETURN j, r, m`);
  return result.records;
};

const createMasterDealer = async (n1, n2) => {
  const result = await session.run(`MATCH (j:${n1.type}{_id: '${n1._id}'})
                    MATCH (m:${n2.type}{_id: '${n2._id}'})
                    MERGE (j)-[r:MASTER_DEALER]->(m)
                    RETURN j, r, m`);
  return result.records;
};

const findAllUserRelationships = async (id) => {
  const result = await session.run(
    `MATCH (u:User {_id: '${id}' })-[r]->() RETURN r`
  );
  return result.records;
  // return result.records.map((i) => i.get("u").properties);
};
const hasMasterDealer = async (id) => {
  const result = await session.run(
    `MATCH (u:User {_id: '${id}' })-[r:MASTER_DEALER]->() RETURN r`
  );
  return result.records[0]?._fields;
  // return result.records.map((i) => i.get("u").properties);
};
const findByIdAndDeleteWithRelationships = async (id) => {
  await session.run(`MATCH (u:User {_id: '${id}' })-[r]-() DELETE r`);
  await session.run(`MATCH (u:User {_id: '${id}'}) DELETE u`);
  return await findAll();
};


// console.log(await hasMasterDealer('YOMZEE9W'))

export default {
  findAll,
  findById,
  create,
  findByIdAndDelete,
  findByIdAndUpdate,
  createRelationship,
  findAllUserRelationships,
  findByIdAndDeleteWithRelationships,
};
