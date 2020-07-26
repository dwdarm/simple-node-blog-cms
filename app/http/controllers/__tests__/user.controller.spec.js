const expect = require('expect.js');
const sinon = require('sinon');
const errorResponse = require('../../../utils/error-response');
const UserController = require('../user.controller');

describe('UserController test', () => {
  
  it('it should return object', () => {
    const instance = UserController({});
    expect(instance).to.be.an('object');
    expect(instance.getAll).to.be.an('function');
    expect(instance.getById).to.be.an('function');
    expect(instance.getByUsername).to.be.an('function');
    expect(instance.update).to.be.an('function');
  });
  
  describe('UserController.getAll test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should call res.send', async () => {
      const User = { findAndCountAll: sinon.fake.resolves({ count: 0, rows: [] }) }
      const req = { query: {} }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await UserController({User}).getAll(req, res, next);
      
      expect(next.called).to.be.equal(false);
      expect(User.findAndCountAll.calledOnce).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
      expect(res.send.calledWith({ 
        status: 'ok', 
        total: 0, 
        data: []
      })).to.be.equal(true);
    });
    
  });
  
  describe('UserController.getById test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should call res.send', async () => {
      const req = { user: { id: 1, toJSON: () => ({id:1}) } }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await UserController({}).getById(req, res, next);
      
      expect(next.called).to.be.equal(false);
      expect(res.send.called).to.be.equal(true);
      expect(res.send.calledWith({ status: 'ok', data: {id:1} })).to.be.equal(true);
    });
    
  });
  
  describe('UserController.getByUsername test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should sendNotFoundError if user is not found', async () => {
      const sendNotFoundError = sinon.stub(errorResponse, 'sendNotFoundError');
      const User = { getByUsername: sinon.fake.resolves(null) }
      const req = { params: { username: 'foo' } }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await UserController({User}).getByUsername(req, res, next);
      
      expect(next.called).to.be.equal(false);
      expect(User.getByUsername.called).to.be.equal(true);
      expect(User.getByUsername.calledWith('foo')).to.be.equal(true);
      expect(sendNotFoundError.calledOnce).to.be.equal(true);
      expect(sendNotFoundError.calledWith(res)).to.be.equal(true);
      expect(res.send.called).to.be.equal(false);
    });
    
    it('it should call res.send', async () => {
      const sendNotFoundError = sinon.stub(errorResponse, 'sendNotFoundError');
      const User = { getByUsername: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) }) }
      const req = { params: { username: 'foo' } }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await UserController({User}).getByUsername(req, res, next);
      
      expect(next.called).to.be.equal(false);
      expect(User.getByUsername.called).to.be.equal(true);
      expect(User.getByUsername.calledWith('foo')).to.be.equal(true);
      expect(sendNotFoundError.called).to.be.equal(false);
      expect(res.send.called).to.be.equal(true);
      expect(res.send.calledWith({ 
        status: 'ok', 
        data: {id:1} 
      })).to.be.equal(true);
    });
    
  });
  
  describe('UserController.update test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should call res.send', async () => {
      const sequelize = {
        transaction: cb => new Promise(async (resolve, reject) => {
          resolve(await cb())
        })
      }
      const req = {
        user: { 
          id:1, 
          toJSON: () => ({id:1}),
          change: sinon.fake.resolves() 
        },
        body: { about: 'about' }
      }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await UserController({sequelize}).update(req, res, next);
      expect(next.called).to.be.equal(false);
      expect(req.user.change.calledOnce).to.be.equal(true);
      expect(req.user.change.calledWith(req.body)).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
    });
    
  });
  
});
