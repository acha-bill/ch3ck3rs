const UserModel = require('../models/user');
const GenericCrudService = require('./generic-crud-service');

class UserService extends GenericCrudService {
  constructor () {
    super(UserModel);
  }

  /**
   * Find a user by username
   * @param {string} username
   * @returns {Promise<User>}
   */
  async findByUsername (username) {
    return this.findOne({ username });
  }
}

/** @typedef {import('../models/user').UserSchema} User */

const service = new UserService();

module.exports = service;
