process.env.NODE_ENV = 'test';
const request = require('supertest');
const expect = require('expect.js');
const app = require('../../../../index.js');
const jwt = require('../../../../app/utils/jwt');
const { server } = app;
const { User, Category } = app.db;

describe('Admin API Endpoint Test', () => {
  beforeEach(async () => {
    await User.destroy({where: {}});
    await Category.destroy({where: {}});
  });

  afterEach(async () => {
    await User.destroy({where: {}});
    await Category.destroy({where: {}});
  });
  
  describe('Category Endpoint Test', () => {
    
    /**
     * /GET /admin/api/categories
     */
     
    describe('/GET /admin/api/categories', () => {
      it('It should get category lists', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get('/admin/api/categories')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('array');
      });
      it('It should NOT get category lists if token is INVALID', async () => {
        const res = await request(server)
          .get('/admin/api/categories')
          .set('Accept', 'application/json')
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /POST /admin/api/categories
     */
     
    describe('/POST /admin/api/categories', () => {
      it('It should POST a category', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .post('/admin/api/categories')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({title: 'title'})
        expect(res.status).to.eql(201);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.title).to.eql('title');
      });
      it('It should NOT POST a category if there is not TITLE', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .post('/admin/api/categories')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({})
        expect(res.status).to.eql(400);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT POST a category if TITLE is already EXISTS', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        await Category.create({title:'title'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .post('/admin/api/categories')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({title: 'title'})
        expect(res.status).to.eql(400);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT POST a category if token is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const res = await request(server)
          .post('/admin/api/categories')
          .set('Content-Type', 'application/json')
          .send({title: 'title'})
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /GET /admin/api/categories/:id
     */
     
    describe('/GET /admin/api/categories/:id', () => {
      it('It should get a category by ID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const category = await Category.create({title:'title'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get(`/admin/api/categories/${category.id}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.title).to.eql('title');
      });
      it('It should NOT get a category if ID is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get(`/admin/api/categories/asd`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT get a category if token is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const category = await Category.create({title:'title'});
        const res = await request(server)
          .get(`/admin/api/categories/${category.id}`)
          .set('Accept', 'application/json')
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /PUT /admin/api/categories/:id
     */
     
    describe('/PUT /admin/api/categories/:id', () => {
      it('It should UPDATE a category', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const category = await Category.create({title:'title'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .put(`/admin/api/categories/${category.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({title:'new title'})
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.title).to.eql('new title');
      });
      it('It should NOT UPDATE a category if TITLE is already exists', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const category = await Category.create({title:'title'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .put(`/admin/api/categories/${category.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({title:'title'})
        expect(res.status).to.eql(400);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT UPDATE a category if ID is IVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .put(`/admin/api/categories/asd`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({title:'title'})
        expect(res.status).to.eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT UPDATE a category if TOKEN is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const category = await Category.create({title:'title'});
        const res = await request(server)
          .put(`/admin/api/categories/${category.id}`)
          .set('Content-Type', 'application/json')
          .send({title:'title'})
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /DELETE /admin/api/categories/:id
     */
     
    describe('/DELETE /admin/api/categories/:id', () => {
      it('It should DELETE a category', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const category = await Category.create({title:'title'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .delete(`/admin/api/categories/${category.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send()
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
      });
      it('It should NOT DELETE a category if ID is IVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .delete(`/admin/api/categories/asd`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send()
        expect(res.status).to.eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT DELETE a category if TOKEN is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const category = await Category.create({title:'title'});
        const res = await request(server)
          .delete(`/admin/api/categories/${category.id}`)
          .set('Content-Type', 'application/json')
          .send()
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /GET /admin/api/categories/slug/:slug
     */
     
    describe('/GET /admin/api/categories/slug/:slug', () => {
      it('It should get a category by SLUG', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const category = await Category.create({title:'title'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get(`/admin/api/categories/slug/${category.slug}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.title).to.eql('title');
      });
      it('It should NOT get a category if SLUG is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get(`/admin/api/categories/slug/asd`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT get a category if token is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const category = await Category.create({title:'title'});
        const res = await request(server)
          .get(`/admin/api/categories/slug/${category.slug}`)
          .set('Accept', 'application/json')
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
  });
  
});
