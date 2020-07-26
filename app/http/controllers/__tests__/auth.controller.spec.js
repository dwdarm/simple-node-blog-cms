const expect = require('expect.js');
const sinon = require('sinon');
const errorResponse = require('../../../utils/error-response');
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
    
    it('it should call sendNotFoundError if req.body.user is undefined', async () => {
      const generateToken = sinon.stub(jwt, 'generateToken');
      const sendNotFoundError = sinon.stub(errorResponse, 'sendNotFoundError');
      const resp = sinon.fake();
      const sendBadRequestError = sinon.stub(errorResponse, 'sendBadRequestError').returns(resp)
      const user = {
        isPasswordValid: sinon.fake.resolves(false)
      }
      const User = {
        getByUsername: sinon.fake.resolves(null)
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
      expect(User.getByUsername.calledOnce).to.be.equal(true);
      expect(User.getByUsername.calledWith('username')).to.be.equal(true);
      expect(sendNotFoundError.calledOnce).to.be.equal(true);
      expect(sendNotFoundError.calledWith(res)).to.be.equal(true);
      expect(user.isPasswordValid.called).to.be.equal(false);
      expect(sendBadRequestError.called).to.be.equal(false);
      expect(generateToken.called).to.be.equal(false);
      expect(res.send.called).to.be.equal(false);
      expect(next.called).to.be.equal(false);
    });
    
    it('it should call sendBadRequestError if req.body.password is not valid', async () => {
      const generateToken = sinon.stub(jwt, 'generateToken');
      const sendNotFoundError = sinon.stub(errorResponse, 'sendNotFoundError');
      const resp = sinon.fake();
      const sendBadRequestError = sinon.stub(errorResponse, 'sendBadRequestError').returns(resp)
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
      const res = {
        send: sinon.fake()
      }
      const next = sinon.fake();
      
      await AuthController({User}).login(req, res, next);
      
      expect(User.getByUsername.calledOnce).to.be.equal(true);
      expect(User.getByUsername.calledWith('username')).to.be.equal(true);
      expect(sendNotFoundError.called).to.be.equal(false);
      expect(user.isPasswordValid.calledOnce).to.be.equal(true);
      expect(user.isPasswordValid.calledWith('password')).to.be.equal(true);
      expect(sendBadRequestError.called).to.be.equal(true);
      expect(sendBadRequestError.calledWith('Invalid password')).to.be.equal(true);
      expect(resp.called).to.be.equal(true);
      expect(resp.calledWith(res)).to.be.equal(true);
      expect(generateToken.called).to.be.equal(false);
      expect(res.send.called).to.be.equal(false);
      expect(next.called).to.be.equal(false);
    });
    
    it('it should call res.send', async () => {
      const generateToken = sinon.stub(jwt, 'generateToken').resolves('token');
      const sendNotFoundError = sinon.stub(errorResponse, 'sendNotFoundError');
      const resp = sinon.fake();
      const sendBadRequestError = sinon.stub(errorResponse, 'sendBadRequestError').returns(resp)
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
      
      expect(User.getByUsername.calledOnce).to.be.equal(true);
      expect(User.getByUsername.calledWith('username')).to.be.equal(true);
      expect(sendNotFoundError.called).to.be.equal(false);
      expect(user.isPasswordValid.calledOnce).to.be.equal(true);
      expect(user.isPasswordValid.calledWith('password')).to.be.equal(true);
      expect(sendBadRequestError.called).to.be.equal(false);
      expect(generateToken.called).to.be.equal(true);
      expect(res.send.called).to.be.equal(true);
      expect(res.send.calledWith({ status: 'ok', data: { token: 'token' } })).to.be.equal(true);
    });
    
  });
  
});
