const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const HttpStatus = require('http-status-codes');

// const appConfig = require('../app.config');
const routes = require('./routes');

/**
 * Create a server instance
 * @returns {import('express').Express} a new server instance
 */
function createApplication () {
  const app = express();

  // Configure express for CORS and request parsing
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // API routes
  app.use('/', routes);

  // Fallback route
  app.use('/', (req, res) => {
    return res.sendStatus(HttpStatus.NOT_FOUND);
  });

  // General error handler

  app.use(function (err, req, res, next) {
    if (res.headersSent) {
      return next(err);
    }
    console.log(err);
    return res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).send(err);
  });

  return app;
}

module.exports = createApplication;
