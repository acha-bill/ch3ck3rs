const { describe, it, before, after, beforeEach } = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

const mongoHelper = require('../helpers/mongoose');
const userService = require('../../src/services/users');

const testUser = {
  userName: 'test',
  password: 'test1234'
};

describe('User service', () => {
  /**
   * Connect to a new in-memory database before running any tests.
   */
  before(async () => {
    await mongoHelper.run();
  });

  beforeEach(async () => {
    await mongoHelper.clearDb();
  });

  /**
   * Remove and close the db and server.
   */
  after(async () => {
    await mongoHelper.clearDb();
    await mongoHelper.closeConnection();
  });

  it('should find all users', async () => {
    const users = await userService.find();
    expect(users.length).to.equal(0);
  });

  it('should create new user', async () => {
    const user = await userService.create(testUser);
    expect(user.userName).to.equal(testUser.userName);
    const users = await userService.find();
    expect(users.length).to.equal(1);
  });

  it('should modify the existing user', async () => {
    const user = await userService.create(testUser);
    await userService.findByIdAndUpdate(user.id, { fullName: 'John Doe' });
    const updatedUser = await userService.findById(user.id);
    expect(updatedUser.fullName).to.equal('John Doe');
  });

  it('should remove user', async () => {
    const user = await userService.create(testUser);
    await userService.findByIdAndDelete(user.id);
    const deleteUser = await userService.findById(user.id);
    expect(deleteUser).to.be.null;
  });
});
