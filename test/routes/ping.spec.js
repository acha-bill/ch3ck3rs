const { describe, it } = require('mocha');
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');
chai.use(chaiHttp);

const createApplication = require('../../src/app');
/** @type {import('express').Express|import('http').Server} */
const app = createApplication();

describe('ping test', () => {
  describe('POST /ping', () => {
    it('should fail with a status 404, an empty body, and an error', async () => {
      const res = await chai.request(app).post('/ping');
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /ping', () => {
    it('should fail with a status 404, an empty body, and an error', async () => {
      const res = await chai.request(app).put('/ping');
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /ping', () => {
    it('should fail with a status 404, an empty body, and an error', async () => {
      const res = await chai.request(app).delete('/ping');
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('GET /ping', () => {
    it('should return a status code of 200', async () => {
      const res = await chai.request(app).get('/ping');
      expect(res).to.have.status(HttpStatus.OK);
    });

    it('should return the text \'pong\'', done => {
      chai.request(app).get('/ping').end((_err, res) => {
        expect(res.text).to.equal('pong');
        done();
      });
    });

    it('should have an empty body', done => {
      chai.request(app).get('/ping').end((_err, res) => {
        expect(res.body).to.be.empty;
        done();
      });
    });
  });
});
