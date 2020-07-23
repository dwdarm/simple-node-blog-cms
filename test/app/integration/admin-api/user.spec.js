process.env.NODE_ENV = 'test';
const request = require('supertest');
const expect = require('expect.js');
const app = require('../../../../index.js');
const jwt = require('../../../../app/utils/jwt');
const { server } = app;
const { User } = app.db;

describe('Admin API Endpoint Test', () => {

  beforeEach(async () => {
    await User.destroy({where: {}});
  });

  afterEach(async () => {
    await User.destroy({where: {}});
  });
  
  describe('User Endpoint Test', () => {
    
    /**
     * /GET /admin/api/users
     */
     
    describe('/GET /admin/api/users', () => {
      it('It should get user lists', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get('/admin/api/users')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('array');
      });
      it('It should NOT get user lists if token is INVALID', async () => {
        const res = await request(server)
          .get('/admin/api/users')
          .set('Accept', 'application/json')
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /GET /admin/api/users/:id
     */
     
    describe('/GET /admin/api/users/:id', () => {
      it('It should get a user by given ID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get(`/admin/api/users/${user.id}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('object');
      });
      it('It should NOT get a user if ID is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get(`/admin/api/users/asd`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT get a user if token is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const res = await request(server)
          .get(`/admin/api/users/${user.id}`)
          .set('Accept', 'application/json')
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /GET /admin/api/users/username/:username
     */
     
    describe('/GET /admin/api/users/username/:username', () => {
      it('It should get a user by given USERNAME', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get(`/admin/api/users/username/${user.username}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('object');
      });
      it('It should NOT get a user if USERNAME is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get(`/admin/api/users/username/beta`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT get a user if token is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const res = await request(server)
          .get(`/admin/api/username/${user.username}`)
          .set('Accept', 'application/json')
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /PUT /admin/api/users/:id
     */
     
    describe('/PUT /admin/api/users/:id', () => {
      it('It should UPDATE a user by given ID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .put(`/admin/api/users/${user.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({username:'beta', fullName: 'Beta'})
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.username).to.eql('beta');
        expect(res.body.data.fullName).to.eql('Beta');
      });
      it('It should NOT UPDATE a user if ID is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .put(`/admin/api/users/asd`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({username:'beta'})
        expect(res.status).to.eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT UPDATE a user if token is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const res = await request(server)
          .put(`/admin/api/users/${user.id}`)
          .set('Content-Type', 'application/json')
          .send({username:'beta'})
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT UPDATE a user if ID is DIFFERENT', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const other = await User.create({username: 'beta', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .put(`/admin/api/users/${other.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({username:'charlie'})
        expect(res.status).to.eql(403);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT UPDATE a user if USERNAME is already USED', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const other = await User.create({username: 'beta', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .put(`/admin/api/users/${user.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({username:'beta'})
        expect(res.status).to.eql(400);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
  });

});
