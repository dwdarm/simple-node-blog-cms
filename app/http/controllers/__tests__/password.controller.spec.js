const expect = require('expect.js');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const Mail = require('../../../utils/mail');
const PasswordController = require('../password.controller');

describe('PasswordController test', () => {
  
  it('it should return object', () => {
    const instance = PasswordController({});
    expect(instance).to.be.an('object');
    expect(instance.getForgotPassword).to.be.an('function');
    expect(instance.postForgotPassword).to.be.an('function');
    expect(instance.getResetPassword).to.be.an('function');
    expect(instance.postResetPassword).to.be.an('function');
  });
  
  describe('PasswordController.getForgotPassword test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should render forgot-password', async () => {
      const req = { csrfToken: sinon.fake() }
      const res = { render: sinon.fake() }
      const next = sinon.fake();
      
      await PasswordController({}).getForgotPassword(req, res, next);
      
      expect(req.csrfToken.calledOnce).to.be.equal(true);
      expect(res.render.calledOnce).to.be.equal(true);
      expect(res.render.calledWith('admin/forgot-password', { 
        csrfToken: req.csrfToken() 
      })).to.be.equal(true);
      expect(next.called).to.be.equal(false);
    });
    
  });
  
  describe('PasswordController.postForgotPassword test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should render notification with status 404 if user is not found', async () => {
      const User = { findOne: sinon.fake.resolves(null) }
      const req = { body: { username: 'user' } }
      const res = {}
      res.status = sinon.fake.returns(res);
      res.render = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await PasswordController({User}).postForgotPassword(req, res, next);
      
      expect(res.status.calledOnce).to.be.equal(true);
      expect(res.status.calledWith(404)).to.be.equal(true);
      expect(res.render.calledOnce).to.be.equal(true);
      expect(res.render.calledWith('admin/notification')).to.be.equal(true);
    });
    
    it('it should render notification and modify password token if it is exist', async () => {
      const send = sinon.stub(Mail.prototype, 'send').resolves();
      const passwordToken = { save: sinon.fake.resolves(null) }
      const user = {
        id: 1,
        getPasswordToken: sinon.fake.resolves(passwordToken),
        createPasswordToken: sinon.fake.resolves(null)
      }
      const User = { findOne: sinon.fake.resolves(user) }
      const req = { body: { username: 'user' } }
      const res = {}
      res.render = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await PasswordController({User}).postForgotPassword(req, res, next);
      
      expect(res.render.calledOnce).to.be.equal(true);
      expect(res.render.calledWith('admin/notification')).to.be.equal(true);
      expect(user.createPasswordToken.called).to.be.equal(false);
      expect(passwordToken.save.calledOnce).to.be.equal(true);
      expect(send.called).to.be.equal(true);
    });
    
    it('it should render notification and creating password token if not found', async () => {
      const send = sinon.stub(Mail.prototype, 'send').resolves();
      const passwordToken = { save: sinon.fake.resolves(null) }
      const user = {
        id: 1,
        getPasswordToken: sinon.fake.resolves(null),
        createPasswordToken: sinon.fake.resolves(null)
      }
      const User = { findOne: sinon.fake.resolves(user) }
      const req = { body: { username: 'user' } }
      const res = {}
      res.render = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await PasswordController({User}).postForgotPassword(req, res, next);
      
      expect(res.render.calledOnce).to.be.equal(true);
      expect(res.render.calledWith('admin/notification')).to.be.equal(true);
      expect(user.createPasswordToken.calledOnce).to.be.equal(true);
      expect(passwordToken.save.calledOnce).to.be.equal(false);
      expect(send.called).to.be.equal(true);
    });
    
  });
  
  describe('PasswordController.getResetPassword test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should render notification with status 400 if user not found', async () => {
      const User = {
        findByPk: sinon.fake.resolves(null)
      }
      const req = { params: { id: 1, token: 'token' } }
      const res = {}
      res.status = sinon.fake.returns(res);
      res.render = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await PasswordController({User}).getResetPassword(req, res, next);
      
      expect(res.status.calledOnce).to.be.equal(true);
      expect(res.status.calledWith(400)).to.be.equal(true);
      expect(res.render.calledOnce).to.be.equal(true);
      expect(res.render.calledWith('admin/notification')).to.be.equal(true);
    });
    
    it('it should render notification with with status 400 if password token not found', async () => {
      const user = {
        id: 1,
        getPasswordToken: sinon.fake.resolves(null)
      }
      const User = {
        findByPk: sinon.fake.resolves(user)
      }
      const req = { params: { id: 1, token: 'token' } }
      const res = {}
      res.status = sinon.fake.returns(res);
      res.render = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await PasswordController({User}).getResetPassword(req, res, next);
      
      expect(res.status.calledOnce).to.be.equal(true);
      expect(res.status.calledWith(400)).to.be.equal(true);
      expect(res.render.calledOnce).to.be.equal(true);
      expect(res.render.calledWith('admin/notification')).to.be.equal(true);
    });
    
    it('it should render notification with status 400 if token is not valid', async () => {
      const compare = sinon.stub(bcrypt, 'compare').resolves(false);
      const user = {
        id: 1,
        getPasswordToken: sinon.fake.resolves({token:'token'})
      }
      const User = {
        findByPk: sinon.fake.resolves(user)
      }
      const req = { params: { id: 1, token: 'token' } }
      const res = {}
      res.status = sinon.fake.returns(res);
      res.render = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await PasswordController({User}).getResetPassword(req, res, next);
      
      expect(res.status.calledOnce).to.be.equal(true);
      expect(res.status.calledWith(400)).to.be.equal(true);
      expect(res.render.calledOnce).to.be.equal(true);
      expect(res.render.calledWith('admin/notification')).to.be.equal(true);
    });
    
    it('it should render reset-password', async () => {
      const compare = sinon.stub(bcrypt, 'compare').resolves(true);
      const user = {
        id: 1,
        getPasswordToken: sinon.fake.resolves({token:'token'})
      }
      const User = {
        findByPk: sinon.fake.resolves(user)
      }
      const req = { params: { id: 1, token: 'token' }, csrfToken: sinon.fake() }
      const res = { render: sinon.fake() }
      const next = sinon.fake();
      
      await PasswordController({User}).getResetPassword(req, res, next);
      
      expect(res.render.calledOnce).to.be.equal(true);
      expect(res.render.calledWith('admin/reset-password')).to.be.equal(true);
    });
    
  });
  
  describe('PasswordController.postResetPassword test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should render notification with status 400 if user not found', async () => {
      const User = {
        findByPk: sinon.fake.resolves(null)
      }
      const req = { 
        params: { id: 1, token: 'token' }, 
        body: { password: 'password' }
      }
      const res = {}
      res.status = sinon.fake.returns(res);
      res.render = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await PasswordController({User}).postResetPassword(req, res, next);
      
      expect(res.status.calledOnce).to.be.equal(true);
      expect(res.status.calledWith(400)).to.be.equal(true);
      expect(res.render.calledOnce).to.be.equal(true);
      expect(res.render.calledWith('admin/notification')).to.be.equal(true);
    });
    
    it('it should render notification with status 400 if password token not found', async () => {
      const user = {
        id: 1,
        getPasswordToken: sinon.fake.resolves(null),
        setPasswordToken: sinon.fake.resolves(),
        save: sinon.fake.resolves()
      }
      const User = {
        findByPk: sinon.fake.resolves(user)
      }
      const req = { 
        params: { id: 1, token: 'token' }, 
        body: { password: 'password' }
      }
      const res = {}
      res.status = sinon.fake.returns(res);
      res.render = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await PasswordController({User}).postResetPassword(req, res, next);
      
      expect(res.status.calledOnce).to.be.equal(true);
      expect(res.status.calledWith(400)).to.be.equal(true);
      expect(res.render.calledOnce).to.be.equal(true);
      expect(res.render.calledWith('admin/notification')).to.be.equal(true);
      expect(user.save.called).to.be.equal(false);
    });
    
    it('it should render notification with status 400 if token is not valid', async () => {
      const compare = sinon.stub(bcrypt, 'compare').resolves(false);
      const user = {
        id: 1,
        getPasswordToken: sinon.fake.resolves({token:'token'}),
        setPasswordToken: sinon.fake.resolves(),
        save: sinon.fake.resolves()
      }
      const User = {
        findByPk: sinon.fake.resolves(user)
      }
      const req = { 
        params: { id: 1, token: 'token' }, 
        body: { password: 'password' }
      }
      const res = {}
      res.status = sinon.fake.returns(res);
      res.render = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await PasswordController({User}).postResetPassword(req, res, next);
      
      expect(res.status.calledOnce).to.be.equal(true);
      expect(res.status.calledWith(400)).to.be.equal(true);
      expect(res.render.calledOnce).to.be.equal(true);
      expect(res.render.calledWith('admin/notification')).to.be.equal(true);
      expect(user.save.called).to.be.equal(false);
    });
    
    it('it should render notification with status 400 if password is not a string', async () => {
      const compare = sinon.stub(bcrypt, 'compare').resolves(false);
      const user = {
        id: 1,
        getPasswordToken: sinon.fake.resolves({token:'token'}),
        setPasswordToken: sinon.fake.resolves(),
        save: sinon.fake.resolves()
      }
      const User = {
        findByPk: sinon.fake.resolves(user)
      }
      const req = { 
        params: { id: 1, token: 'token' }, 
        body: { password: null }
      }
      const res = {}
      res.status = sinon.fake.returns(res);
      res.render = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await PasswordController({User}).postResetPassword(req, res, next);
      
      expect(res.status.calledOnce).to.be.equal(true);
      expect(res.status.calledWith(400)).to.be.equal(true);
      expect(res.render.calledOnce).to.be.equal(true);
      expect(res.render.calledWith('admin/notification')).to.be.equal(true);
      expect(user.save.called).to.be.equal(false);
    });
    
    it('it should render notification with status 400 if password length is less than 4', async () => {
      const compare = sinon.stub(bcrypt, 'compare').resolves(false);
      const user = {
        id: 1,
        getPasswordToken: sinon.fake.resolves({token:'token'}),
        setPasswordToken: sinon.fake.resolves(),
        save: sinon.fake.resolves()
      }
      const User = {
        findByPk: sinon.fake.resolves(user)
      }
      const req = { 
        params: { id: 1, token: 'token' }, 
        body: { password: 'asd' }
      }
      const res = {}
      res.status = sinon.fake.returns(res);
      res.render = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await PasswordController({User}).postResetPassword(req, res, next);
      
      expect(res.status.calledOnce).to.be.equal(true);
      expect(res.status.calledWith(400)).to.be.equal(true);
      expect(res.render.calledOnce).to.be.equal(true);
      expect(res.render.calledWith('admin/notification')).to.be.equal(true);
      expect(user.save.called).to.be.equal(false);
    });
    
    it('it should render notification', async () => {
      const compare = sinon.stub(bcrypt, 'compare').resolves(true);
      const user = {
        id: 1,
        getPasswordToken: sinon.fake.resolves({token:'token'}),
        setPasswordToken: sinon.fake.resolves(),
        save: sinon.fake.resolves()
      }
      const User = {
        findByPk: sinon.fake.resolves(user)
      }
      const req = { 
        params: { id: 1, token: 'token' }, 
        body: { password: 'password' }
      }
      const res = { render: sinon.fake() }
      const next = sinon.fake();
      
      await PasswordController({User}).postResetPassword(req, res, next);
      
      expect(user.setPasswordToken.calledOnce).to.be.equal(true);
      expect(user.setPasswordToken.calledWith(null)).to.be.equal(true);
      expect(user.password).to.be.equal('password');
      expect(user.save.calledOnce).to.be.equal(true);
      expect(res.render.calledOnce).to.be.equal(true);
      expect(res.render.calledWith('admin/notification')).to.be.equal(true);
    });
    
  });
  
});
