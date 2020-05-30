// Load data from a .env file into process.env if available
require('dotenv').config();

const config = {};

config.production = {
  env: 'production',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  mongoUrl: process.env.MONGO_URL
};

config.testing = {
  env: 'testing',
  port: process.env.PORT || 3210,
  jwtSecret: process.env.JWT_SECRET || 'This is a secret!',
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost/ch3ck3ers'
};

config.development = {
  env: 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'This is a secret!',
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost/ch3ck3rs'
};

const mode = process.env.NODE_ENV || 'development';

const toExport = config[mode];
// Stop the application if some config variables are not defined
if (!toExport.jwtSecret || !toExport.mongoUrl) {
  console.log('Some essential configuration values have not been defined');
  console.log('Check that you have set the \'MONGO_URL\' and \'MONGO_URL\' variables');
  console.log('Shuting down application...');
  process.exit(-1);
}

module.exports = config[mode];
