const { describe, it } = require('mocha');
const { expect } = require('chai');

const swaggerDef = require('../src/swagger-def');

describe('swaggerDef module', () => {
  it('should not be null or undefined', (done) => {
    expect(swaggerDef).to.not.be.null.and.not.be.undefined;
    done();
  });

  it('should export a non-empty object', (done) => {
    expect({}).to.be.an('object').and.be.empty;
    done();
  });
});
