import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log(`Ping DB success`);
} catch (err) {
  console.error(`Ping DB failed`, err);
}

const db = client.db("people");
export default db;
