const expect = require('expect.js');
const sinon = require('sinon');
const CsrfMiddleware = require('../csrf.middleware');

describe('CsrfMiddleware test', () => {
  
  it('it should return object', () => {
    const instance = CsrfMiddleware();
    expect(instance).to.be.an('object');
    expect(instance.init).to.be.an('function');
    expect(instance.trim).to.be.an('function');
  });
  
  describe('CsrfMiddleware.trim test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should call next()', () => {
      const req = { body: { _csrf: 'token' } }
      const next = sinon.fake();
      CsrfMiddleware().trim(req, null, next);
      expect(next.called).to.be.equal(true);
    });
    
  });
  
});
