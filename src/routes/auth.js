const HttpStatus = require('http-status-codes');
const router = require('express').Router();
const authService = require('../services/auth');

/**
 *  @swagger
 *  paths:
 *    /api/v1/auth/register:
 *      post:
 *        summary: Creates a user and returns the newly created user
 *        tags:
 *          - Auth
 *        operationId: register
 *        requestBody:
 *          required: true
 *          description: A JSON object that contains the user's information.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        responses:
 *          '201':
 *            description: Created
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 */
router.post('/auth/register', async (req, res, next) => {
  const user = req.body;
  try {
    const result = await authService.register(user);
    return res.status(HttpStatus.CREATED).json(result);
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/auth/login:
 *      post:
 *        summary: Logs in a user and retursn the jwt encode of the user
 *        tags:
 *          - Auth
 *        operationId: login
 *        parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                password:
 *                  type: string
 *        responses:
 *          '201':
 *            description: Created
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    jwt:
 *                      type: string
 *                      description: The jwt
 */
router.post('/auth/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const jwt = await authService.login(username, password);
    return res.status(HttpStatus.CREATED).json({ jwt });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
