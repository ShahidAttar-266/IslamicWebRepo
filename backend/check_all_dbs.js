const { MongoClient } = require('mongodb');
require('dotenv').config({ path: __dirname + '/.env' });

async function main() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const adminDb = client.db('admin').admin();
    const listDbs = await adminDb.listDatabases();
    
    for (let db of listDbs.databases) {
      console.log(`\nDatabase: ${db.name}`);
      const database = client.db(db.name);
      const collections = await database.listCollections().toArray();
      for (let c of collections) {
        const count = await database.collection(c.name).countDocuments();
        console.log(`  - ${c.name}: ${count} documents`);
        
        if (c.name.toLowerCase().includes('name')) {
          const docs = await database.collection(c.name).find({}).limit(5).toArray();
          console.log(`    Preview of ${c.name}:`, JSON.stringify(docs, null, 2));
        }
      }
    }
  } finally {
    await client.close();
  }
}

main().catch(console.error);