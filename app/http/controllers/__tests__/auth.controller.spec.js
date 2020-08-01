const expect = require('expect.js');
const sinon = require('sinon');
const jwt = require('../../../utils/jwt');
const AuthController = require('../auth.controller');

describe('AuthController test', () => {
  
  it('it should return object', () => {
    const instance = AuthController({});
    expect(instance).to.be.an('object');
    expect(instance.login).to.be.an('function');
  });
  
  describe('AuthController.login test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should send status 404 if user is not found', async () => {
      const User = {
        getByUsername: sinon.fake.resolves(null)
      }
      const req = {
        body: {
          username: 'username',
          password: 'password'
        }
      }
      const res = {}
      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await AuthController({User}).login(req, res, next);
      
      expect(res.status.calledOnce).to.be.equal(true);
      expect(res.status.calledWith(404)).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
    });
    
    it('it should call end status 400 if password is not valid', async () => {
      const user = {
        id: 1,
        isPasswordValid: sinon.fake.resolves(false)
      }
      const User = {
        getByUsername: sinon.fake.resolves(user)
      }
      const req = {
        body: {
          username: 'username',
          password: 'password'
        }
      }
      const res = {}
      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await AuthController({User}).login(req, res, next);
      
      expect(res.status.calledOnce).to.be.equal(true);
      expect(res.status.calledWith(400)).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
    });
    
    it('it should call res.send', async () => {
      const generateToken = sinon.stub(jwt, 'generateToken').resolves('token');

      const user = {
        id: 1,
        isPasswordValid: sinon.fake.resolves(true)
      }
      const User = {
        getByUsername: sinon.fake.resolves(user)
      }
      const req = {
        body: {
          username: 'username',
          password: 'password'
        }
      }
      const res = {
        send: sinon.fake()
      }
      const next = sinon.fake();
      
      await AuthController({User}).login(req, res, next);
      
      expect(res.send.calledOnce).to.be.equal(true);
      expect(generateToken.calledOnce).to.be.equal(true);
    });
    
  });
  
});
