const expect = require('expect.js');
const sinon = require('sinon');
const ArticleController = require('../article.controller');

describe('ArticleController test', () => {
  
  it('it should return object', () => {
    const instance = ArticleController({});
    expect(instance).to.be.an('object');
    expect(instance.getAll).to.be.an('function');
    expect(instance.getById).to.be.an('function');
    expect(instance.getBySlug).to.be.an('function');
    expect(instance.create).to.be.an('function');
    expect(instance.update).to.be.an('function');
    expect(instance.delete).to.be.an('function');
  });
  
  describe('ArticleController.getAll test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should send only published article when logged user is undefined', async () => {
      const Article = { getAll: sinon.fake.resolves({ count: 0, rows: [] }) }
      const req = { query: {} }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await ArticleController({Article}).getAll(req, res, next);
      
      expect(Article.getAll.calledWith({status:'published'})).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
      expect(res.send.calledWith({ status: 'ok', total: 0, data: [] })).to.be.equal(true);
    });
    
    it('it should send all article with when logged user is undefined', async () => {
      const Article = { getAll: sinon.fake.resolves({ count: 0, rows: [] }) }
      const req = { query: {}, loggedUser: {id:1} }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await ArticleController({Article}).getAll(req, res, next);
      
      expect(Article.getAll.calledWith({status:'published'})).to.be.equal(false);
      expect(res.send.calledOnce).to.be.equal(true);
      expect(res.send.calledWith({ status: 'ok', total: 0, data: [] })).to.be.equal(true);
    });
    
  });
  
  describe('ArticleController.getById test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should send an article', async () => {
      const req = { article: { id: 1, toJSON: () => ({id:1}) } }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await ArticleController({}).getById(req, res, next);
      
      expect(res.send.called).to.be.equal(true);
      expect(res.send.calledWith({ status: 'ok', data: {id:1} })).to.be.equal(true);
    });
    
  });
  
  describe('ArticleController.getBySlug test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should send status 404 if article is not found', async () => {
      const Article = {
        getBySlug: sinon.fake.resolves(null)
      }
      const req = {
        params: { slug: 'foo' }
      }
      const res = {}
      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await ArticleController({Article}).getBySlug(req, res, next);
      expect(res.status.calledWith(404)).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
    });
    
    it('it should send an article', async () => {
      const Article = {
        getBySlug: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) })
      }
      const req = {
        params: { slug: 'foo' }
      }
      const res = {
        send: sinon.fake()
      }
      const next = sinon.fake();
      
      await ArticleController({Article}).getBySlug(req, res, next);
      expect(res.send.calledWith({ status: 'ok', data: {id:1} })).to.be.equal(true);
    });
    
  });
  
  describe('ArticleController.create test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should send status 400 if title is undefined', async () => {
      const req = {
        body: {}
      }
      const res = {}
      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await ArticleController({}).create(req, res, next);
      expect(res.status.calledWith(400)).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
    });
    
    it('it should send status 400 if title is not a string', async () => {
      const req = {
        body: { title: 123 }
      }
      const res = {}
      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await ArticleController({}).create(req, res, next);
      expect(res.status.calledWith(400)).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
    });
    
    it('it should send status 400 if title is an empty string', async () => {
      const req = {
        body: { title: '' }
      }
      const res = {}
      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await ArticleController({}).create(req, res, next);
      expect(res.status.calledWith(400)).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
    });
    
    it('it should create an article', async () => {
      const Article = {
        createNew: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) }),
        getById: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) })
      }
      const sequelize = {
        transaction: cb => new Promise(async (resolve, reject) => {
          resolve(await cb())
        })
      }
      const req = {
        loggedUser: {
          addArticle: sinon.fake.resolves()
        },
        body: { title: 'title' }
      }
      const res = {}
      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);
      const next = sinon.fake();
      
      await ArticleController({Article, sequelize}).create(req, res, next);
      expect(Article.createNew.calledWith({ title: 'title' })).to.be.equal(true);
      expect(req.loggedUser.addArticle.calledOnce).to.be.equal(true);
      expect(res.status.calledWith(201)).to.be.equal(true);
      expect(res.send.calledWith({ status: 'ok', data: {id:1} })).to.be.equal(true);
    });
    
  });
  
  describe('ArticleController.update test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should update an article', async () => {
      const sequelize = {
        transaction: cb => new Promise(async (resolve, reject) => {
          resolve(await cb())
        })
      }
      const req = {
        article: { 
          id:1, 
          toJSON: () => ({id:1}),
          change: sinon.fake.resolves() 
        },
        body: { title: 'title' }
      }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await ArticleController({sequelize}).update(req, res, next);
      expect(req.article.change.calledWith(req.body)).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
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
        article: { id:1, destroy: sinon.fake.resolves() },
        body: { title: 'title' }
      }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await ArticleController({sequelize}).delete(req, res, next);
      expect(req.article.destroy.calledOnce).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
    });
    
  });
  
});
