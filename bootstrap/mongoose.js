const mongoose = require('mongoose');

let mongooseConnection;

/**
 *  Connect to MongoDB
 *  @returns {Promise<import('mongoose').Mongoose>}
 */
async function run (mongoUrl, forceResfresh = false) {
  if (mongooseConnection && !forceResfresh) { return mongooseConnection; }

  try {
    /** @type {import('mongoose').ConnectionOptions} */
    const mongooseOptions = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    };

    mongooseConnection = await mongoose.connect(mongoUrl, mongooseOptions);
    return mongooseConnection;
  } catch (e) {
    console.log('Error while connecting to MongoDB');
    console.log(e);
    process.exit(-1);
  }
};

module.exports = run;
