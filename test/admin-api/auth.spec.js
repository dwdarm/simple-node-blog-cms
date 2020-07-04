process.env.NODE_ENV = 'test';
const request = require('supertest');
const expect = require('expect.js');
const app = require('../../app');
const { server } = app;
const { User } = app.models;

describe('Admin API Endpoint Test', () => {

  beforeEach(async () => {
    await User.destroy({truncate: true});
  });

  afterEach(async () => {
    await User.destroy({truncate: true});
  });
  
  describe('Auth Endpoint Test', () => {
    
    /**
     * /POST /client/api/auth
     */
     
    describe('/PUT /admin/api/auth', () => {
      it('It should get a token', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const res = await request(server)
          .post('/admin/api/auth')
          .set('Accept', 'application/json')
          .send({username: 'alpha', password: '12345678'});
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.token).to.be.an('string');
      });
      it('It should NOT get a token if user is not FOUND', async () => {
        const res = await request(server)
          .post('/admin/api/auth')
          .set('Accept', 'application/json')
          .send({username: 'alpha', password: '12345678'});
        expect(res.status).to.eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT get a token if password is FALSE', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const res = await request(server)
          .post('/admin/api/auth')
          .set('Accept', 'application/json')
          .send({username: 'alpha', password: '12345675'});
        expect(res.status).to.eql(400);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
  });

});
