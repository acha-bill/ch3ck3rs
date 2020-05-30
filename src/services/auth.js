const userService = require('./users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const appConfig = require('../../app.config');
const ClientError = require('../exceptions/client-error');

class AuthService {
  /**
   * Registers a new user
   * @param {User} user
   * @returns {Promise<User>} The created user
   */
  register (user) {
    return userService.create(user);
  }

  /**
   * Logs in a user and returns the JWT encode of the user
   * @param {string} username
   * @param {string} password
   */
  async login (username, password) {
    const user = await userService.findByUsername(username);
    if (!user) {
      throw new ClientError('User not found');
    }
    await bcrypt.compare(password, user.password);
    return jwt.sign(user.toJSON(), appConfig.jwtSecret);
  }

  /**
   * Verifies the jwt and returns the payload.
   * @param {string} token
   * @returns {Promise<User>}
   */
  async verifyJwt (token) {
    try {
      const user = await jwt.verify(token, appConfig.jwtSecret);
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

const service = new AuthService();

module.exports = service;

/** @typedef {import('../models/user').UserSchema} User */
