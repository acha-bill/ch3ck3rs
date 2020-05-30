const UserService = require('../services/users');
const faker = require('faker');

function makeRandomUser () {
  const user = {};
  user.username = faker.internet.userName();
  user.displayName = faker.internet.userName(faker.name.firstName(), faker.name.lastName());
  user.password = faker.internet.password();
  user.photoURL = faker.internet.avatar();
  return user;
}

function runDefault () {}
runDefault.generateOne = async () => {
  /** @type {User} */
  const user = makeRandomUser();
  return user;
};

runDefault.generateOneAndSave = async () => {
  const users = await runDefault.generateOne();
  /** @type {User} */
  const savedUser = await UserService.create(users);
  return savedUser;
};

runDefault.generate = async (count = 1) => {
  /** @type {User[]} */
  const users = new Array(count).fill({})
    .map(() => makeRandomUser());
  return users;
};

runDefault.generateAndSave = async (count = 1) => {
  const users = await runDefault.generate(count);
  /** @type {User[]} */
  const savedUsers = [];
  for (let u of users) {
    u = await UserService.create(u);
    savedUsers.push(u);
  }
  return savedUsers;
};

/** @typedef {import('../models/user').UserSchema} User */

module.exports = runDefault;
