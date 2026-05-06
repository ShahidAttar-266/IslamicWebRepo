const { MongoClient } = require('mongodb');
require('dotenv').config({ path: __dirname + '/.env' });

async function main() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db(); 
    
    const collections = await database.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    for (let c of collections) {
        const docs = await database.collection(c.name).find({}).toArray();
        console.log(`\nCollection [${c.name}] has ${docs.length} documents.`);
        if (c.name === 'names') {
             console.log("Names:", JSON.stringify(docs, null, 2));
        }
    }
  } finally {
    await client.close();
  }
}

main().catch(console.error);