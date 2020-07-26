const expect = require('expect.js');
const sinon = require('sinon');
const errorResponse = require('../../../utils/error-response');
const ResourceMiddleware = require('../resource.middleware');

describe('ResourceMiddleware test', () => {
  
  it('it should return object', () => {
    const instance = ResourceMiddleware({})('Resource');
    expect(instance).to.be.an('object');
    expect(instance.getResource).to.be.an('function');
    expect(instance.isOwner).to.be.an('function');
  });
  
  describe('ResourceMiddleware.getResource test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should NOT call next if req.params.id is not a integer', async  () => {
      const sendNotFoundError = sinon.stub(errorResponse, 'sendNotFoundError');
      const Resource = { getById: sinon.fake.resolves({id:1}) }
      const req = { params: { id: 'asd' } }
      const res = {}
      const next = sinon.fake();
      
      await ResourceMiddleware({Resource})('Resource').getResource(req, res, next);
      
      expect(sendNotFoundError.calledOnce).to.be.equal(true);
      expect(sendNotFoundError.calledWith(res)).to.be.equal(true);
      expect(Resource.getById.called).to.be.equal(false);
      expect(req.resource).to.be.equal(undefined);
      expect(next.called).to.be.equal(false);
    });
    
    it('it should NOT call next if db[Resource].getById return null', async  () => {
      const sendNotFoundError = sinon.stub(errorResponse, 'sendNotFoundError');
      const Resource = { getById: sinon.fake.resolves(null) }
      const req = { params: { id: 1 } }
      const res = {}
      const next = sinon.fake();
      
      await ResourceMiddleware({Resource})('Resource').getResource(req, res, next);
      
      expect(sendNotFoundError.calledOnce).to.be.equal(true);
      expect(sendNotFoundError.calledWith(res)).to.be.equal(true);
      expect(Resource.getById.called).to.be.equal(true);
      expect(Resource.getById.calledWith(1)).to.be.equal(true);
      expect(req.resource).to.be.equal(undefined);
      expect(next.called).to.be.equal(false);
    });
    
    it('it should call next()', async  () => {
      const sendNotFoundError = sinon.stub(errorResponse, 'sendNotFoundError');
      const Resource = { getById: sinon.fake.resolves({id:1}) }
      const req = { params: { id: 1 } }
      const res = {}
      const next = sinon.fake();
      
      await ResourceMiddleware({Resource})('Resource').getResource(req, res, next);
      
      expect(sendNotFoundError.calledOnce).to.be.equal(false);
      expect(Resource.getById.called).to.be.equal(true);
      expect(Resource.getById.calledWith(1)).to.be.equal(true);
      expect(req.resource).to.be.an('object');
      expect(next.called).to.be.equal(true);
    });
    
  });
  
   describe('ResourceMiddleware.isOwner test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should NOT call next if req.loggedUser.id not equal resource.id with Resource is User', () => {
      const sendForbiddenError = sinon.stub(errorResponse, 'sendForbiddenError');
      const req = { 
        loggedUser: { id: 1 },
        user: { id: 2 }
      }
      const res = {}
      const next = sinon.fake();
      
      ResourceMiddleware({})('User').isOwner(req, res, next);
      
      expect(sendForbiddenError.calledOnce).to.be.equal(true);
      expect(sendForbiddenError.calledWith(res)).to.be.equal(true);
      expect(next.called).to.be.equal(false);
    });
    
    it('it should NOT call next if req.loggedUser.id not equal resource.id with Resource is Not User', () => {
      const sendForbiddenError = sinon.stub(errorResponse, 'sendForbiddenError');
      const req = { 
        loggedUser: { id: 1 },
        resource: { User: { id: 2 } }
      }
      const res = {}
      const next = sinon.fake();
      
      ResourceMiddleware({})('Resource').isOwner(req, res, next);
      
      expect(sendForbiddenError.calledOnce).to.be.equal(true);
      expect(sendForbiddenError.calledWith(res)).to.be.equal(true);
      expect(next.called).to.be.equal(false);
    });
    
    it('it should next with Resource is User', () => {
      const sendForbiddenError = sinon.stub(errorResponse, 'sendForbiddenError');
      const req = { 
        loggedUser: { id: 1 },
        user: { id: 1 }
      }
      const res = {}
      const next = sinon.fake();
      
      ResourceMiddleware({})('User').isOwner(req, res, next);
      
      expect(sendForbiddenError.called).to.be.equal(false);
      expect(next.called).to.be.equal(true);
    });
    
    it('it should next with Resource is Not User', () => {
      const sendForbiddenError = sinon.stub(errorResponse, 'sendForbiddenError');
      const req = { 
        loggedUser: { id: 1 },
        resource: { User: { id: 1 } }
      }
      const res = {}
      const next = sinon.fake();
      
      ResourceMiddleware({})('Resource').isOwner(req, res, next);
      
      expect(sendForbiddenError.called).to.be.equal(false);
      expect(next.called).to.be.equal(true);
    });
    
  });
  
});
