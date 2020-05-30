const http = require('http');
const createApplication = require('./app');

/**
 *  Create a new server
 *  @returns {import('http').Server}
 */
function createServer () {
  const app = createApplication();
  const server = http.createServer(app);
  return server;
}

module.exports = createServer;
