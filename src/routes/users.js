const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const authGuard = require('../middleware/auth-guard');
const transforms = require('../utils/transforms');
const userService = require('../services/users');

/**
 *  @swagger
 *  paths:
 *    /api/v1/users:
 *      get:
 *        summary: Lists users
 *        description: Lists all users in the system
 *        tags:
 *          - User
 *        responses:
 *          200:
 *            description: Ok
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/User'
 */
router.get('/users', authGuard, async (req, res, next) => {
  let users;
  try {
    users = await userService.find({});
  } catch (e) {
    return next(e);
  }
  return res.status(HttpStatus.OK).json(transforms.transformMany(users));
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/users/{id}:
 *      get:
 *        summary: Get basic user information
 *        description: Get basic user information
 *        tags:
 *          - User
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              required: true
 *              description: The id of the user
 *        responses:
 *          200:
 *            description: Ok
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 */
router.get('/users/:id', authGuard, async (req, res, next) => {
  let user;
  try {
    user = await userService.findById(req.params.id);
  } catch (e) {
    console.log(e);
    throw e;
  }
  return res.status(HttpStatus.OK).json(transforms.transformOne(user));
});

/**
 * @swagger
 * paths:
 *   /api/v1/users/me/profile:
 *     get:
 *       summary: Get the current user
 *       tags:
 *         - User
 *       operationId: me
 *       responses:
 *         200:
 *           description: Ok
 *           content:
 *             apppliaction/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/users/me/profile', authGuard, async (req, res, next) => {
  return res.status(HttpStatus.OK).json(req.auth);
});

module.exports = router;
