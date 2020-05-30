const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const setUpMongoose = require('../../bootstrap/mongoose');

const mongod = new MongoMemoryServer();

const clearDb = async () => {
  for (const key in mongoose.connection.collections) {
    const collection = mongoose.connection.collections[key];
    await collection.deleteMany();
  }
};

const closeConnection = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  const mongod = new MongoMemoryServer();
  await mongod.stop();
};

/**
 *  Connect to MongoDB
 *  @returns {Promise<import('mongoose').Mongoose>}
 */
const run = async () => {
  try {
    const mongoUri = await mongod.getConnectionString();

    return await setUpMongoose(mongoUri, true);
  } catch (e) {
    console.log('Error while connecting to MongoDB');
    console.log(e);
    process.exit(-1);
  }
};

module.exports = {
  clearDb,
  closeConnection,
  run
};
