const HttpStatus = require('http-status-codes');
const authService = require('../services/auth');

/**
 *  Middleware to allow access to a route only if the requester is logged in
 */
async function authGuard (req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      error: 'Authorization header has not been set'
    });
  }
  try {
    const user = await authService.verifyJwt(authorization);
    req.auth = user;
    return next();
  } catch (e) {
    console.error(e);
    return res.status(HttpStatus.UNAUTHORIZED).json(e);
  }
}

module.exports = authGuard;
