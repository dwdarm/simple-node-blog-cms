const expect = require('expect.js');
const sinon = require('sinon');
const errorResponse = require('../../../utils/error-response');
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
    
    it('it should call res.send with req.loggedUser is undefined', async () => {
      const Article = { getAll: sinon.fake.resolves({ count: 0, rows: [] }) }
      const req = { query: {} }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await ArticleController({Article}).getAll(req, res, next);
      
      expect(next.called).to.be.equal(false);
      expect(Article.getAll.calledOnce).to.be.equal(true);
      expect(Article.getAll.calledWith({status:'published'})).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
      expect(res.send.calledWith({ status: 'ok', total: 0, data: [] })).to.be.equal(true);
    });
    
    it('it should call res.send with req.loggedUser is NOT undefined', async () => {
      const Article = { getAll: sinon.fake.resolves({ count: 0, rows: [] }) }
      const req = { query: {status:'draft'}, loggedUser: {id:1} }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await ArticleController({Article}).getAll(req, res, next);
      
      expect(next.called).to.be.equal(false);
      expect(Article.getAll.calledOnce).to.be.equal(true);
      expect(Article.getAll.calledWith({status:'draft'})).to.be.equal(true);
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
    
    it('it should call res.send', async () => {
      const req = { article: { id: 1, toJSON: () => ({id:1}) } }
      const res = { send: sinon.fake() }
      const next = sinon.fake();
      
      await ArticleController({}).getById(req, res, next);
      
      expect(next.called).to.be.equal(false);
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
    
    it('it should call sendNotFoundError if article is not found', async () => {
      const sendNotFoundError = sinon.stub(errorResponse, 'sendNotFoundError');
      const Article = {
        getBySlug: sinon.fake.resolves(null)
      }
      const req = {
        params: { slug: 'foo' }
      }
      const res = {
        send: sinon.fake()
      }
      const next = sinon.fake();
      
      await ArticleController({Article}).getBySlug(req, res, next);
      expect(next.called).to.be.equal(false);
      expect(Article.getBySlug.called).to.be.equal(true);
      expect(Article.getBySlug.calledWith('foo')).to.be.equal(true);
      expect(sendNotFoundError.calledOnce).to.be.equal(true);
      expect(sendNotFoundError.calledWith(res)).to.be.equal(true);
      expect(res.send.called).to.be.equal(false);
    });
    
    it('it should call res.send', async () => {
      const sendNotFoundError = sinon.stub(errorResponse, 'sendNotFoundError');
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
      expect(next.called).to.be.equal(false);
      expect(Article.getBySlug.called).to.be.equal(true);
      expect(Article.getBySlug.calledWith('foo')).to.be.equal(true);
      expect(sendNotFoundError.called).to.be.equal(false);
      expect(res.send.called).to.be.equal(true);
      expect(res.send.calledWith({ 
        status: 'ok', 
        data: {id:1} 
      })).to.be.equal(true);
    });
    
  });
  
  describe('ArticleController.create test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should call sendBadRequestError if req.body.title is undefined', async () => {
      const resp = sinon.fake();
      const sendBadRequestError = sinon.stub(errorResponse, 'sendBadRequestError').returns(resp);
      const Article = {
        createNew: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) }),
        getById: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) })
      }
      const sequelize = {
        transaction: (cb) => {
          cb();
        }
      }
      const req = {
        loggedUser: {
          addArticle: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) })
        },
        body: {}
      }
      const res = {
        send: sinon.fake()
      }
      const next = sinon.fake();
      
      await ArticleController({Article, sequelize}).create(req, res, next);
      expect(next.called).to.be.equal(false);
      expect(sendBadRequestError.called).to.be.equal(true);
      expect(sendBadRequestError.calledWith('Title not found')).to.be.equal(true);
      expect(Article.createNew.called).to.be.equal(false);
      expect(req.loggedUser.addArticle.called).to.be.equal(false);
      expect(Article.getById.called).to.be.equal(false);
      expect(res.send.called).to.be.equal(false);
    });
    
    it('it should call sendBadRequestError if req.body.title is not a string', async () => {
      const resp = sinon.fake();
      const sendBadRequestError = sinon.stub(errorResponse, 'sendBadRequestError').returns(resp);
      const Article = {
        createNew: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) }),
        getById: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) })
      }
      const sequelize = {
        transaction: (cb) => {
          cb();
        }
      }
      const req = {
        loggedUser: {
          addArticle: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) })
        },
        body: { title: 123 }
      }
      const res = {
        send: sinon.fake()
      }
      const next = sinon.fake();
      
      await ArticleController({Article, sequelize}).create(req, res, next);
      expect(next.called).to.be.equal(false);
      expect(sendBadRequestError.called).to.be.equal(true);
      expect(sendBadRequestError.calledWith('Title not found')).to.be.equal(true);
      expect(Article.createNew.called).to.be.equal(false);
      expect(req.loggedUser.addArticle.called).to.be.equal(false);
      expect(Article.getById.called).to.be.equal(false);
      expect(res.send.called).to.be.equal(false);
    });
    
    it('it should call sendBadRequestError if req.body.title is an empty string', async () => {
      const resp = sinon.fake();
      const sendBadRequestError = sinon.stub(errorResponse, 'sendBadRequestError').returns(resp);
      const Article = {
        createNew: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) }),
        getById: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) })
      }
      const sequelize = {
        transaction: (cb) => {
          cb();
        }
      }
      const req = {
        loggedUser: {
          addArticle: sinon.fake.resolves({id:1, toJSON: () => ({id:1}) })
        },
        body: { title: '' }
      }
      const res = {
        send: sinon.fake()
      }
      const next = sinon.fake();
      
      await ArticleController({Article, sequelize}).create(req, res, next);
      expect(next.called).to.be.equal(false);
      expect(sendBadRequestError.called).to.be.equal(true);
      expect(sendBadRequestError.calledWith('Title not found')).to.be.equal(true);
      expect(Article.createNew.called).to.be.equal(false);
      expect(req.loggedUser.addArticle.called).to.be.equal(false);
      expect(Article.getById.called).to.be.equal(false);
      expect(res.send.called).to.be.equal(false);
    });
    
    it('it should call res.send', async () => {
      const resp = sinon.fake();
      const sendBadRequestError = sinon.stub(errorResponse, 'sendBadRequestError').returns(resp);
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
      expect(next.called).to.be.equal(false);
      expect(sendBadRequestError.called).to.be.equal(false);
      expect(Article.createNew.calledOnce).to.be.equal(true);
      expect(Article.createNew.calledWith({ title: 'title' })).to.be.equal(true);
      expect(req.loggedUser.addArticle.calledOnce).to.be.equal(true);
      expect(Article.getById.calledOnce).to.be.equal(true);
      expect(res.status.calledOnce).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
    });
    
  });
  
  describe('ArticleController.update test', () => {
    
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
      expect(next.called).to.be.equal(false);
      expect(req.article.change.calledOnce).to.be.equal(true);
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
      expect(next.called).to.be.equal(false);
      expect(req.article.destroy.calledOnce).to.be.equal(true);
      expect(res.send.calledOnce).to.be.equal(true);
    });
    
  });
  
});
