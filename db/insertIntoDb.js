const fs = require('fs');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: "../.env"})

const MONGODB_URI = process.env.MONGODB_URI;

const collectionName = 'targetWords';
const filePath = 'target_words.txt';

async function updateMongoDBCollection() {
  let client;
  try {
    // Read the updated text file and split it into a set of words
    const updatedWordsSet = new Set(fs.readFileSync(filePath, 'utf-8').split('\n').map(word => word.trim()));

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db();
    const collection = db.collection(collectionName);

    // Get the existing words from the collection as a set
    const existingWordsSet = new Set((await collection.distinct('word')).map(word => word.trim()));

    // Find words to be removed (existing in DB but not in the updated text file)
    const wordsToRemove = [...existingWordsSet].filter(word => !updatedWordsSet.has(word));

    // Find new words to be added (existing in the updated text file but not in DB)
    const newWordsToAdd = [...updatedWordsSet].filter(word => !existingWordsSet.has(word));

    // Remove words that are no longer present in the updated text file
    if (wordsToRemove.length > 0) {
      await collection.deleteMany({ word: { $in: wordsToRemove } });
      console.log('Removed words:', wordsToRemove.join(', '));
    }

    // Add new words that are in the updated text file
    if (newWordsToAdd.length > 0) {
      const newWordDocuments = newWordsToAdd.map(word => ({ word }));
      await collection.insertMany(newWordDocuments);
      console.log('Added words:', newWordsToAdd.join(', '));
    }

    console.log('MongoDB collection has been updated successfully.');

    // Close the MongoDB connection
    client.close();
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

updateMongoDBCollection();
