const expect = require('expect.js');
const sinon = require('sinon');
const Routes = require('../../app/config/routes');
const Server = require('../server');

describe('/internal/server.js test', () => {
  
  afterEach(() => {
    sinon.restore();
  });
  
  it('it should NOT return undefined', () => {
    const RoutesStub = sinon.stub(Routes, 'init');
    const server = Server.init();
    expect(server).not.to.equal(undefined);
    expect(RoutesStub.calledOnce).to.be.equal(true);
  });
  
});
