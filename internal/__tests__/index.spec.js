const expect = require('expect.js');
const sinon = require('sinon');
const fs = require('fs');
const Server = require('../server');
const DB = require('../db');
const Index = require('../index.js');

const path = require('path');
const MIDDLEWARES_DIR = path.join(__dirname, '../../app/http/middlewares');
const CONTROLLERS_DIR = path.join(__dirname, '../../app/http/controllers');

describe('/internal/index.js test', () => {
  
  afterEach(() => {
    sinon.restore();
  });
  
  it('it should return object', () => {
    const fsStub = sinon.stub(fs, 'readdirSync');
    fsStub.withArgs(MIDDLEWARES_DIR).returns([]);
    fsStub.withArgs(CONTROLLERS_DIR).returns([]);
    
    const DBStub = sinon.stub(DB, 'init').returns({});
    const ServerStub = sinon.stub(Server, 'init').returns(null);
    
    const index = Index.init();
    expect(index).to.be.an('object');
    expect(index.db).to.be.an('object');
    expect(index.server).not.to.equal(undefined);
    expect(DBStub.calledOnce).to.be.equal(true);
    expect(ServerStub.calledOnce).to.be.equal(true);
    expect(fsStub.calledTwice).to.be.equal(true);
  });
  
});
