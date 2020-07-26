const expect = require('expect.js');
const sinon = require('sinon');
const errorResponse = require('../../../utils/error-response');
const CategoryController = require('../category.controller');

describe('CategoryController test', () => {
  
  it('it should return object', () => {
    const instance = CategoryController({});
    expect(instance).to.be.an('object');
    expect(instance.getAll).to.be.an('function');
    expect(instance.getById).to.be.an('function');
    expect(instance.getBySlug).to.be.an('function');
    expect(instance.create).to.be.an('function');
    expect(instance.update).to.be.an('function');
    expect(instance.delete).to.be.an('function');
  });
  
  describe('CategoryController.getAll test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should call res.send', async () => {
      const Category = { findAll: sinon.fake.resolves([]) }
      const req = { query: {} }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await CategoryController({Category}).getAll(req, res, next);
      
      expect(next.called).to.be.equal(false);
      expect(Category.findAll.calledOnce).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
      expect(res.send.calledWith({ status: 'ok', data: [] })).to.be.equal(true);
    });
    
  });
  
  describe('CategoryController.getById test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should call res.send', async () => {
      const req = { category: { id: 1, toJSON: () => ({id:1}) } }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await CategoryController({}).getById(req, res, next);
      
      expect(next.called).to.be.equal(false);
      expect(res.send.called).to.be.equal(true);
      expect(res.send.calledWith({ status: 'ok', data: req.category })).to.be.equal(true);
    });
    
  });
  
  describe('CategoryController.getBySlug test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should call sendNotFoundError if category is not found', async () => {
      const sendNotFoundError = sinon.stub(errorResponse, 'sendNotFoundError');
      const Category = { findOne: sinon.fake.resolves(null) }
      const req = { params: { slug: 'foo' } }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await CategoryController({Category}).getBySlug(req, res, next);
      
      expect(next.called).to.be.equal(false);
      expect(Category.findOne.called).to.be.equal(true);
      expect(Category.findOne.calledWith({where: { slug: req.params.slug }})).to.be.equal(true);
      expect(sendNotFoundError.calledOnce).to.be.equal(true);
      expect(sendNotFoundError.calledWith(res)).to.be.equal(true);
      expect(res.send.called).to.be.equal(false);
    });
    
    it('it should call res.send', async () => {
      const sendNotFoundError = sinon.stub(errorResponse, 'sendNotFoundError');
      const Category = { findOne: sinon.fake.resolves({id:1}) }
      const req = { params: { slug: 'foo' } }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await CategoryController({Category}).getBySlug(req, res, next);
      
      expect(next.called).to.be.equal(false);
      expect(Category.findOne.called).to.be.equal(true);
      expect(Category.findOne.calledWith({where: { slug: req.params.slug }})).to.be.equal(true);
      expect(sendNotFoundError.called).to.be.equal(false);
      expect(res.send.called).to.be.equal(true);
      expect(res.send.calledWith({ status: 'ok', data: {id:1} })).to.be.equal(true);
    });
    
  });
  
  describe('CategoryController.create test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should call sendBadRequestError if req.body.title is undefined', async () => {
      const resp = sinon.fake();
      const sendBadRequestError = sinon.stub(errorResponse, 'sendBadRequestError').returns(resp);
      const Category = {
        create: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) }),
        findOne: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) })
      }
      const sequelize = {
        transaction: cb => new Promise(async (resolve, reject) => {
          resolve(await cb())
        })
      }
      const req = { body: {} }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await CategoryController({Category, sequelize}).create(req, res, next);
      
      expect(next.called).to.be.equal(false);
      expect(sendBadRequestError.called).to.be.equal(true);
      expect(sendBadRequestError.calledWith('Title not found')).to.be.equal(true);
      expect(resp.calledOnce).to.be.equal(true);
      expect(resp.calledWith(res)).to.be.equal(true);
      expect(Category.findOne.called).to.be.equal(false);
      expect(Category.create.called).to.be.equal(false);
      expect(res.send.called).to.be.equal(false);
    });
    
    it('it should call sendBadRequestError if req.body.title is not a string', async () => {
      const resp = sinon.fake();
      const sendBadRequestError = sinon.stub(errorResponse, 'sendBadRequestError').returns(resp);
      const Category = {
        create: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) }),
        findOne: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) })
      }
      const sequelize = {
        transaction: cb => new Promise(async (resolve, reject) => {
          resolve(await cb())
        })
      }
      const req = { body: { title: 123 } }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await CategoryController({Category, sequelize}).create(req, res, next);
      
      expect(next.called).to.be.equal(false);
      expect(sendBadRequestError.called).to.be.equal(true);
      expect(sendBadRequestError.calledWith('Title not found')).to.be.equal(true);
      expect(resp.calledOnce).to.be.equal(true);
      expect(resp.calledWith(res)).to.be.equal(true);
      expect(Category.findOne.called).to.be.equal(false);
      expect(Category.create.called).to.be.equal(false);
      expect(res.send.called).to.be.equal(false);
    });
    
    it('it should call sendBadRequestError if req.body.title is an empty string', async () => {
      const resp = sinon.fake();
      const sendBadRequestError = sinon.stub(errorResponse, 'sendBadRequestError').returns(resp);
      const Category = {
        create: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) }),
        findOne: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) })
      }
      const sequelize = {
        transaction: cb => new Promise(async (resolve, reject) => {
          resolve(await cb())
        })
      }
      const req = { body: { title: '' } }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await CategoryController({Category, sequelize}).create(req, res, next);
      
      expect(next.called).to.be.equal(false);
      expect(sendBadRequestError.called).to.be.equal(true);
      expect(sendBadRequestError.calledWith('Title not found')).to.be.equal(true);
      expect(resp.calledOnce).to.be.equal(true);
      expect(resp.calledWith(res)).to.be.equal(true);
      expect(Category.findOne.called).to.be.equal(false);
      expect(Category.create.called).to.be.equal(false);
      expect(res.send.called).to.be.equal(false);
    });
    
    it('it should call sendBadRequestError if title is already exists', async () => {
      const resp = sinon.fake();
      const sendBadRequestError = sinon.stub(errorResponse, 'sendBadRequestError').returns(resp);
      const Category = {
        create: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) }),
        findOne: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) })
      }
      const sequelize = {
        transaction: cb => new Promise(async (resolve, reject) => {
          resolve(await cb())
        })
      }
      const req = { body: { title: 'title' } }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await CategoryController({Category, sequelize}).create(req, res, next);
      
      expect(next.called).to.be.equal(false);
      expect(sendBadRequestError.called).to.be.equal(true);
      expect(sendBadRequestError.calledWith('Category already exists')).to.be.equal(true);
      expect(resp.calledOnce).to.be.equal(true);
      expect(resp.calledWith(res)).to.be.equal(true);
      expect(Category.findOne.calledOnce).to.be.equal(true);
      expect(Category.findOne.calledWith({ where: { title: req.body.title } })).to.be.equal(true);
      expect(Category.create.called).to.be.equal(false);
      expect(res.send.called).to.be.equal(false);
    });
    
    it('it should call res.send', async () => {
      const resp = sinon.fake();
      const sendBadRequestError = sinon.stub(errorResponse, 'sendBadRequestError').returns(resp);
      const Category = {
        create: sinon.fake.resolves({id:1}),
        findOne: sinon.fake.resolves(null)
      }
      const sequelize = {
        transaction: cb => new Promise(async (resolve, reject) => {
          resolve(await cb())
        })
      }
      const req = { body: { title: 'title' } }
      const res = {}
      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await CategoryController({Category, sequelize}).create(req, res, next);
      
      expect(next.called).to.be.equal(false);
      expect(sendBadRequestError.called).to.be.equal(false);
      expect(Category.findOne.calledOnce).to.be.equal(true);
      expect(Category.findOne.calledWith({ where: { title: req.body.title } })).to.be.equal(true);
      expect(Category.create.calledOnce).to.be.equal(true);
      expect(Category.create.calledWith({ title: req.body.title })).to.be.equal(true);
      expect(res.status.calledOnce).to.be.equal(true);
      expect(res.status.calledWith(201)).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
      expect(res.send.calledWith({ status: 'ok', data: {id:1} })).to.be.equal(true);
    });
    
  });
  
  describe('Category.update test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should call sendBadRequestError if title is already exists', async () => {
      const resp = sinon.fake();
      const sendBadRequestError = sinon.stub(errorResponse, 'sendBadRequestError').returns(resp);
      const Category = { findOne: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) }) }
      const sequelize = {
        transaction: cb => new Promise(async (resolve, reject) => {
          resolve(await cb())
        })
      }
      const req = {
        category: { 
          id:1, 
          toJSON: () => ({id:1}),
          save: sinon.fake.resolves() 
        },
        body: { title: 'title' }
      }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await CategoryController({Category, sequelize}).update(req, res, next);
      expect(next.called).to.be.equal(false);
      expect(sendBadRequestError.called).to.be.equal(true);
      expect(sendBadRequestError.calledWith('Category already exists')).to.be.equal(true);
      expect(resp.calledOnce).to.be.equal(true);
      expect(resp.calledWith(res)).to.be.equal(true);
      expect(Category.findOne.calledOnce).to.be.equal(true);
      expect(Category.findOne.calledWith({ where: { title: req.body.title } })).to.be.equal(true);
      expect(req.category.save.called).to.be.equal(false);
      expect(res.send.called).to.be.equal(false);
    });
    
    it('it should call res.send', async () => {
      const resp = sinon.fake();
      const sendBadRequestError = sinon.stub(errorResponse, 'sendBadRequestError').returns(resp);
      const Category = { findOne: sinon.fake.resolves(null) }
      const sequelize = {
        transaction: cb => new Promise(async (resolve, reject) => {
          resolve(await cb())
        })
      }
      const req = {
        category: { 
          id:1, 
          toJSON: () => ({id:1}),
          save: sinon.fake.resolves() 
        },
        body: { title: 'title' }
      }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await CategoryController({Category, sequelize}).update(req, res, next);
      expect(next.called).to.be.equal(false);
      expect(sendBadRequestError.called).to.be.equal(false);
      expect(Category.findOne.calledOnce).to.be.equal(true);
      expect(Category.findOne.calledWith({ where: { title: req.body.title } })).to.be.equal(true);
      expect(req.category.title).to.be.equal(req.body.title);
      expect(req.category.save.calledOnce).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
      expect(res.send.calledWith({ status: 'ok', data: req.category })).to.be.equal(true);
    });
    
  });
  
  describe('ArticleController.delete test', () => {
    
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
        category: { id:1, destroy: sinon.fake.resolves() },
        body: { title: 'title' }
      }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await CategoryController({sequelize}).delete(req, res, next);
      expect(next.called).to.be.equal(false);
      expect(req.category.destroy.calledOnce).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
    });
    
  });
  
});
