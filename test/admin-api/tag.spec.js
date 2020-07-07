process.env.NODE_ENV = 'test';
const request = require('supertest');
const expect = require('expect.js');
const app = require('../../app');
const jwt = require('../../admin-api/jwt');
const { server } = app;
const { User, Tag } = app.models;

describe('Admin API Endpoint Test', () => {
  beforeEach(async () => {
    await User.destroy({truncate: true});
    await Tag.destroy({truncate: true});
  });

  afterEach(async () => {
    await User.destroy({truncate: true});
    await Tag.destroy({truncate: true});
  });
  
  describe('Tag Endpoint Test', () => {
    
    /**
     * /GET /admin/api/tags
     */
     
    describe('/GET /admin/api/tags', () => {
      it('It should get tag lists', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get('/admin/api/tags')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('array');
      });
      it('It should NOT get tag lists if token is INVALID', async () => {
        const res = await request(server)
          .get('/admin/api/tags')
          .set('Accept', 'application/json')
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /POST /admin/api/tags
     */
     
    describe('/POST /admin/api/tags', () => {
      it('It should POST a tag', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .post('/admin/api/tags')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({title: 'title'})
        expect(res.status).to.eql(201);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.title).to.eql('title');
      });
      it('It should NOT POST a tag if there is not TITLE', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .post('/admin/api/tags')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({})
        expect(res.status).to.eql(400);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT POST a tag if TITLE is already EXISTS', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        await Tag.create({title:'title'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .post('/admin/api/tags')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({title: 'title'})
        expect(res.status).to.eql(400);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT POST a tag if token is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const res = await request(server)
          .post('/admin/api/tags')
          .set('Content-Type', 'application/json')
          .send({title: 'title'})
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /GET /admin/api/tags/:id
     */
     
    describe('/GET /admin/api/tags/:id', () => {
      it('It should get a tag by ID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const tag = await Tag.create({title:'title'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get(`/admin/api/tags/${tag.id}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.title).to.eql('title');
      });
      it('It should NOT get a tag if ID is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get(`/admin/api/tags/asd`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT get a tag if token is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const tag = await Tag.create({title:'title'});
        const res = await request(server)
          .get(`/admin/api/tags/${tag.id}`)
          .set('Accept', 'application/json')
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /PUT /admin/api/tags/:id
     */
     
    describe('/PUT /admin/api/tags/:id', () => {
      it('It should UPDATE a tag', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const tag = await Tag.create({title:'title'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .put(`/admin/api/tags/${tag.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({title:'new title'})
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.title).to.eql('new title');
      });
      it('It should NOT UPDATE a tag if TITLE is already exists', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const tag = await Tag.create({title:'title'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .put(`/admin/api/tags/${tag.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({title:'title'})
        expect(res.status).to.eql(400);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT UPDATE a tag if ID is IVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .put(`/admin/api/tags/asd`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({title:'title'})
        expect(res.status).to.eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT UPDATE a tag if TOKEN is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const tag = await Tag.create({title:'title'});
        const res = await request(server)
          .put(`/admin/api/tags/${tag.id}`)
          .set('Content-Type', 'application/json')
          .send({title:'title'})
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /DELETE /admin/api/tags/:id
     */
     
    describe('/DELETE /admin/api/tags/:id', () => {
      it('It should DELETE a tag', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const tag = await Tag.create({title:'title'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .delete(`/admin/api/tags/${tag.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send()
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
      });
      it('It should NOT DELETE a tag if ID is IVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .delete(`/admin/api/tags/asd`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send()
        expect(res.status).to.eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT DELETE a tag if TOKEN is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const tag = await Tag.create({title:'title'});
        const res = await request(server)
          .delete(`/admin/api/tags/${tag.id}`)
          .set('Content-Type', 'application/json')
          .send()
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /GET /admin/api/tags/slug/:slug
     */
     
    describe('/GET /admin/api/tags/slug/:slug', () => {
      it('It should get a tag by SLUG', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const tag = await Tag.create({title:'title'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get(`/admin/api/tags/slug/${tag.slug}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.title).to.eql('title');
      });
      it('It should NOT get a tag if SLUG is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get(`/admin/api/tags/slug/asd`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT get a tag if token is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const tag = await Tag.create({title:'title'});
        const res = await request(server)
          .get(`/admin/api/tags/slug/${tag.slug}`)
          .set('Accept', 'application/json')
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
  });
  
});
