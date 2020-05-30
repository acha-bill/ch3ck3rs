require('dotenv').config();
const setUpMongoose = require('./bootstrap/mongoose');
const createServer = require('./src/server');
const appConfig = require('./app.config');

async function init () {
  await setUpMongoose(appConfig.mongoUrl);
  return createServer();
}

init().then(server => {
  // Start the server
  server.listen(process.env.PORT, async () => {
    console.log(`Listening at http://localhost:${appConfig.port} in ${appConfig.env} mode`);
  });
});

if (process.env.NODE_ENV === 'production') {
  // Catch any uncaught exceptions in this application
  process.on('uncaughtException', (err) => {
    console.log(`There was an uncaught exception: ${err}`);
  });

  // Catch any unhandled rejections in this application
  process.on('unhandledRejection', (err) => {
    console.log(`There was an unhandled rejection: ${err}`);
  });
}
