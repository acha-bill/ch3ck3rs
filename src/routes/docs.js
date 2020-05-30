const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const HttpStatus = require('http-status-codes');

const swaggerDocument = require('../swagger-def');

/**
 *  @swagger
 *  /api/v1/openapi.json:
 *    get:
 *      summary: OpenAPI Specifications document
 *      description: Fetch the OpenAPI specifications for this API as a JSON file
 *      tags:
 *        - Documentation
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: OpenAPI Specifications
 */
router.get('/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(HttpStatus.OK).json(swaggerDocument);
});

/**
 *  /api/v1/docs:
 *  description: A Swagger UI documentation for this API
 */
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
