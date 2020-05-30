const authService = require('../../src/services/auth');
const userService = require('../../src/services/users');

const login = async (username, password) => {
  const jwt = await authService.login(username, password);
  return jwt;
};

/**
 *
 * @param {User} user
 * @returns {Promise<{user, jwt}>}
 */
const createUserAndLogin = async (user) => {
  const exists = await userService.findByUsername(user.username);
  if (exists) { return exists; }

  try {
    var result = await authService.register(user);
    const jwt = await authService.login(user.username, user.password);
    return { user: result, jwt };
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  createUserAndLogin,
  login
};
