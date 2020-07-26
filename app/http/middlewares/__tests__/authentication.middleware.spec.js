const expect = require('expect.js');
const sinon = require('sinon');
const jwt = require('../../../utils/jwt');
const AuthMiddleware = require('../authentication.middleware');

describe('AuthMiddleware test', () => {
  
  it('it should return object', () => {
    const instance = AuthMiddleware({ db: {} });
    expect(instance).to.be.an('object');
    expect(instance.authenticate).to.be.an('function');
  });
  
  describe('AuthMiddleware.authenticate test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should NOT call next if auth header is NULL', async () => {
      const jwtStub = sinon.stub(jwt, 'verifyToken');
      const User = { getById: sinon.fake.resolves(null) }
      const req = { get: sinon.fake.returns(null) }
      const res = {}
      res.status = sinon.fake.returns(res),
      res.send = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await AuthMiddleware({User}).authenticate(req, res, next);
      expect(req.get.called).to.be.equal(true);
      expect(res.status.called).to.be.equal(true);
      expect(res.send.called).to.be.equal(true);
      expect(jwtStub.called).to.be.equal(false);
      expect(User.getById.called).to.be.equal(false);
      expect(next.called).to.be.equal(false);
    });
    
    it('it should NOT call next if auth token is NULL', async () => {
      const jwtStub = sinon.stub(jwt, 'verifyToken');
      const User = { getById: sinon.fake.resolves(null) }
      const req = { get: sinon.fake.returns('Bearer') }
      const res = {}
      res.status = sinon.fake.returns(res),
      res.send = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await AuthMiddleware({User}).authenticate(req, res, next);
      expect(req.get.called).to.be.equal(true);
      expect(res.status.called).to.be.equal(true);
      expect(res.send.called).to.be.equal(true);
      expect(jwtStub.called).to.be.equal(false);
      expect(User.getById.called).to.be.equal(false);
      expect(next.called).to.be.equal(false);
    });
    
    it('it should NOT call next if auth token is INVALID', async () => {
      const jwtStub = sinon.stub(jwt, 'verifyToken').rejects();
      const User = { getById: sinon.fake.resolves(null) }
      const req = { get: sinon.fake.returns('Bearer token') }
      const res = {}
      res.status = sinon.fake.returns(res),
      res.send = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await AuthMiddleware({User}).authenticate(req, res, next);
      expect(req.get.called).to.be.equal(true);
      expect(res.status.called).to.be.equal(true);
      expect(res.send.called).to.be.equal(true);
      expect(jwtStub.calledOnce).to.be.equal(true);
      expect(jwtStub.calledWith('token')).to.be.equal(true);
      expect(User.getById.called).to.be.equal(false);
      expect(next.called).to.be.equal(false);
    });
    
    it('it should NOT call next if userId is invalid', async () => {
      const jwtStub = sinon.stub(jwt, 'verifyToken').resolves({id:1});
      const User = { getById: sinon.fake.resolves(null) }
      const req = { get: sinon.fake.returns('Bearer token') }
      const res = {}
      res.status = sinon.fake.returns(res),
      res.send = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await AuthMiddleware({ User }).authenticate(req, res, next);
      expect(req.get.called).to.be.equal(true);
      expect(res.status.called).to.be.equal(true);
      expect(res.send.called).to.be.equal(true);
      expect(User.getById.called).to.be.equal(true);
      expect(jwtStub.calledOnce).to.be.equal(true);
      expect(jwtStub.calledWith('token')).to.be.equal(true);
      expect(User.getById.calledOnce).to.be.equal(true);
      expect(User.getById.calledWith(1)).to.be.equal(true);
      expect(next.called).to.be.equal(false);
    });
    
    it('it should call next', async () => {
      const jwtStub = sinon.stub(jwt, 'verifyToken').resolves({id:1});
      const User = { getById: sinon.fake.resolves({id:1}) }
      const req = { get: sinon.fake.returns('Bearer token') }
      const res = {}
      res.status = sinon.fake.returns(res),
      res.send = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await AuthMiddleware({ User }).authenticate(req, res, next);
      expect(req.get.called).to.be.equal(true);
      expect(res.status.called).to.be.equal(false);
      expect(res.send.called).to.be.equal(false);
      expect(User.getById.called).to.be.equal(true);
      expect(next.called).to.be.equal(true);
      expect(jwtStub.calledOnce).to.be.equal(true);
      expect(jwtStub.calledWith('token')).to.be.equal(true);
      expect(User.getById.calledOnce).to.be.equal(true);
      expect(User.getById.calledWith(1)).to.be.equal(true);
      expect(req.loggedUser).not.to.equal(undefined);
    });
    
  });
  
});
