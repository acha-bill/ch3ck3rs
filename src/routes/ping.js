const HttpStatus = require('http-status-codes');
const router = require('express').Router();

/**
 *  @swagger
 *  /ping:
 *    get:
 *      summary: ping test
 *      description: Ping the server to check if it's online
 *      tags:
 *        - Ping
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: pong
 */
router.get('/ping', (req, res) => {
  res.status(HttpStatus.OK).end('pong');
});

module.exports = router;
