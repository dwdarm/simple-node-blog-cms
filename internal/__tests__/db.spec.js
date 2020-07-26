const expect = require('expect.js');

describe('/internal/db.js test', () => {
  
  it('it should return object', () => {
    const db = require('../db.js').init();
    expect(db).to.be.an('object');
    expect(db.Sequelize).not.to.equal(undefined);
    expect(db.sequelize).not.to.equal(undefined);
  });
  
});
