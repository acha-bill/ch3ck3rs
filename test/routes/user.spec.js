const { describe, it, before, after, beforeEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');
chai.use(chaiHttp);

const createApplication = require('../../src/app');
const app = createApplication();
const mongoHelper = require('../helpers/mongoose');
const userHelper = require('../helpers/user');

let testUser = { user: null, jwt: null };
describe('Users Endpoint Test', () => {
  before(async () => {
    await mongoHelper.run();
    await mongoHelper.clearDb();
  });

  after(async () => {
    await mongoHelper.clearDb();
    await mongoHelper.closeConnection();
  });

  beforeEach(async () => {
    await mongoHelper.clearDb();

    try {
      testUser = await userHelper.createUserAndLogin({
        userName: 'test',
        password: 'test1234'
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  });

  describe('GET /api/v1/users', () => {
    it('should fetch all users and have a status of 200', async () => {
      const res = await chai.request(app).get('/api/v1/users')
        .set('Authorization', testUser.jwt);
      expect(res.error).to.be.false;
      expect(res.body).to.have.length.greaterThan(0);
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('GET /api/v1/users/me/profile', () => {
    it('should fetch the requester\'s user details', async () => {
      const res = await chai.request(app).get('/api/v1/users/me/profile')
        .set('Authorization', testUser.jwt);
      expect(res.error).to.be.false;
      expect(res.body).to.not.be.empty;
      expect(res).to.have.status(HttpStatus.OK);
    });
  });
});
