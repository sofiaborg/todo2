const { MongoClient } = require("mongodb");

async function getDb() {
  const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
  await client.connect();

  const db = client.db("todo_2");
  return db;
}

async function getTaskCollection() {
  const db = await getDb();
  return db.collection("tasks");
}

module.exports = { getTaskCollection };
