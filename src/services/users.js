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

  /**
   * Adds a game to the user game list
   * @param {String} userId
   * @param {String} gameId
   */
  async addGame (userId, gameId) {
    return this.findByIdAndUpdate(userId, {
      $push: {
        games: gameId
      }
    });
  }
}

/** @typedef {import('../models/user').UserSchema} User */

const service = new UserService();

module.exports = service;
