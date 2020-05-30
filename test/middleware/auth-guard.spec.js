const { describe, it, before, after, beforeEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');
chai.use(chaiHttp);

const mongoHelper = require('../helpers/mongoose');
const userHelper = require('../helpers/user');
const authGuard = require('../../src/middleware/auth-guard');
const createApplication = require('../../src/app');
const app = createApplication();

const testUrl = '/api/v1/auth-only';
const testHandler = async (req, res, next) => {
  return res.status(HttpStatus.OK).end('Auth!');
};

let testUser = { user: null, jwt: null };

describe('API test for auth-based access', () => {
  before(async () => {
    await mongoHelper.run();
    await mongoHelper.clearDb();

    // Create test routes
    app.get(testUrl, authGuard, testHandler);
    app.get(testUrl, authGuard, testHandler);
  });

  after(async () => {
    await mongoHelper.clearDb();
    await mongoHelper.closeConnection();

    // Delete test routes
    app.get(testUrl, (req, res, next) => next());
    app.get(testUrl, (req, res, next) => next());
  });

  beforeEach(async () => {
    await mongoHelper.clearDb();

    try {
      testUser = await userHelper.createUserAndLogin({
        userName: 'test',
        password: 'password'
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  });

  describe(`GET ${testUrl}`, () => {
    it('should return a status code of 200 for an authorized user', async () => {
      try {
        const res = await chai.request(app).get(testUrl).set('Authorization', testUser.jwt);
        expect(res.error).to.be.false;
        expect(res).to.have.status(HttpStatus.OK);
        expect(res.text).to.equal('Auth!');
      } catch (e) {}
    });

    it('should return a status code of 401 for an unauthorized user', async () => {
      try {
        const res = await chai.request(app).get(testUrl);
        expect(res.error).to.be.an('object');
        expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
      } catch (e) {}
    });
  });
});
