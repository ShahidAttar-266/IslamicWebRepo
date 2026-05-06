const { MongoClient } = require('mongodb');
require('dotenv').config({ path: __dirname + '/.env' });

async function checkFavorites() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('myapp');
    const user = await db.collection('users').findOne({ email: 'shahid@gmail.com' });
    console.log("User's savedNames:", user.savedNames);
  } finally {
    await client.close();
  }
}

checkFavorites().catch(console.error);