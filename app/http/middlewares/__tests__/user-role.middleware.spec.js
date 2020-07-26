const expect = require('expect.js');
const sinon = require('sinon');
const UserRoleMiddleware = require('../user-role.middleware');

describe('UserRoleMiddleware test', () => {
  
  it('it should return object', () => {
    expect(UserRoleMiddleware()).to.be.an('object');
    expect(UserRoleMiddleware().isAdmin).to.be.an('function');
  });
  
  describe('UserRoleMiddleware.isAdmin test', () => {
    
    beforeEach(() => {
      sinon.restore();
    });
    
    afterEach(() => {
      sinon.restore();
    });
    
    it('it should call next if user role is admin', () => {
      const req = { loggedUser: { role: 'admin' } }
      const res = {}
      res.status = sinon.fake.returns(res),
      res.send = sinon.fake.returns(res);
      const next = sinon.fake();
      UserRoleMiddleware().isAdmin(req, null, next);
      expect(next.called).to.be.equal(true);
      expect(res.status.called).to.be.equal(false);
      expect(res.status.called).to.be.equal(false);
    });
    
    it('it should NOT call next if user role is NOT admin', () => {
      const req = { loggedUser: { role: 'user' } }
      const res = {}
      res.status = sinon.fake.returns(res),
      res.send = sinon.fake.returns(res);
      const next = sinon.fake();
      UserRoleMiddleware().isAdmin(req, res, next);
      expect(next.called).to.be.equal(false);
      expect(res.status.called).to.be.equal(true);
      expect(res.status.called).to.be.equal(true);
    });
    
  });
  
});
