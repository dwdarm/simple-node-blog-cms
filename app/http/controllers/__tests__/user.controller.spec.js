const expect = require('expect.js');
const sinon = require('sinon');
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
    
    it('it should send all users', async () => {
      const User = { findAndCountAll: sinon.fake.resolves({ count: 0, rows: [] }) }
      const req = { query: {} }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await UserController({User}).getAll(req, res, next);
      
      expect(res.send.calledWith({ status: 'ok', total: 0, data: [] })).to.be.equal(true);
    });
    
  });
  
  describe('UserController.getById test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should send a user by id', async () => {
      const req = { user: { id: 1, toJSON: () => ({id:1}) } }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await UserController({}).getById(req, res, next);
      
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
    
    it('it should send status 404 if user is not found', async () => {
      const User = { getByUsername: sinon.fake.resolves(null) }
      const req = { params: { username: 'foo' } }
      const res = { send: sinon.fake() }
      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await UserController({User}).getByUsername(req, res, next);
      
      expect(res.status.calledWith(404)).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
    });
    
    it('it should send a user by username', async () => {
      const User = { getByUsername: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) }) }
      const req = { params: { username: 'foo' } }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await UserController({User}).getByUsername(req, res, next);
      
      expect(res.send.calledWith({ status: 'ok', data: {id:1} })).to.be.equal(true);
    });
    
  });
  
  describe('UserController.update test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should update a user', async () => {
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

      expect(req.user.change.calledWith(req.body)).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
    });
    
  });
  
});
