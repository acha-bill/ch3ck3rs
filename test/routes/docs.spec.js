const { describe, it } = require('mocha');
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');
chai.use(chaiHttp);

const createApplication = require('../../src/app');
/** @type {import('express').Express|import('http').Server} */
const app = createApplication();

describe('Documentation Endpoint Test', () => {
  describe('POST /api/v1/openapi.json', () => {
    it('should fail with a status 404, an empty body, and an error', async () => {
      const res = await chai.request(app).post('/api/v1/openapi.json');
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('GET /api/v1/openapi.json', () => {
    it('should return a status code of 200', async () => {
      const res = await chai.request(app).get('/api/v1/openapi.json');
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('GET /api/v1/docs', () => {
    it('should return a status code of 200', async () => {
      const res = await chai.request(app).get('/api/v1/docs');
      expect(res).to.have.status(HttpStatus.OK);
    });
  });
});
