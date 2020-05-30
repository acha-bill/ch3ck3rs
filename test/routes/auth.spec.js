const { describe, it, before, after } = require('mocha');
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');
chai.use(chaiHttp);
const createApplication = require('../../src/app');
const app = createApplication();
const mongoHelper = require('../helpers/mongoose');
const userService = require('../../src/services/users');

describe('Auth routes', () => {
  before(async () => {
    await mongoHelper.run();
    await mongoHelper.clearDb();
  });

  after(async () => {
    await mongoHelper.clearDb();
    await mongoHelper.closeConnection();
  });

  it('should create and return user with id', async () => {
    const user = {
      userName: 'test',
      password: 'test1234'
    };
    const res = await chai.request(app).post('/api/v1/auth/register').send(user);
    expect(res).to.have.status(HttpStatus.CREATED);
    expect(res.body).to.have.property('id');
  });
  it('should login a user and return a jwt', async () => {
    const login = {
      userName: 'test',
      password: 'test1234'
    };
    await userService.create(login);
    const res = await chai.request(app).post('/api/v1/auth/login').send(login);
    expect(res.body).to.have.property('jwt');
  });
});
