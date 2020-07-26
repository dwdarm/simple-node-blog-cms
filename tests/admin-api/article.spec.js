process.env.NODE_ENV = 'test';
const request = require('supertest');
const expect = require('expect.js');
const app = require('../../index.js');
const jwt = require('../../app/utils/jwt');
const { server } = app;
const { User, Article } = app.db;

describe('Admin API Endpoint Test', () => {

  beforeEach(async () => {
    await User.destroy({where: {}});
    await Article.destroy({where: {}});
  });

  afterEach(async () => {
    await User.destroy({where: {}});
    await Article.destroy({where: {}});
  });
  
  describe('Article Endpoint Test', () => {
    
    /**
     * /GET /admin/api/articles
     */
     
    describe('/GET /admin/api/articles', () => {
      it('It should get article lists', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get('/admin/api/articles')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('array');
      });
      it('It should NOT get article lists if token is INVALID', async () => {
        const res = await request(server)
          .get('/admin/api/articles')
          .set('Accept', 'application/json')
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /POST /admin/api/articles
     */
     
    describe('/POST /admin/api/articles', () => {
      it('It should POST a article', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .post('/admin/api/articles')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({title: 'Hello', content: 'Hello'})
        expect(res.status).to.eql(201);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.title).to.eql('Hello');
      });
      it('It should NOT POST a article if there is not TITLE', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .post('/admin/api/articles')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({content: 'Hello'})
        expect(res.status).to.eql(400);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT POST a article if token is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const res = await request(server)
          .post('/admin/api/articles')
          .set('Content-Type', 'application/json')
          .send({title: 'Hello', content: 'Hello'})
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /GET /admin/api/articles/:id
     */
     
    describe('/GET /admin/api/articles/:id', () => {
      it('It should get a articles by given ID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const article = await user.createArticle({title: 'Hello', content: 'Hello'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get(`/admin/api/articles/${article.id}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.title).to.eql('Hello');
      });
      it('It should NOT get a article if ID is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get(`/admin/api/articles/asd`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT get a article if token is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const res = await request(server)
          .get(`/admin/api/articles/1`)
          .set('Accept', 'application/json')
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /PUT /admin/api/articles/:id
     */
     
    describe('/PUT /admin/api/articles/:id', () => {
      it('It should UPDATE a article', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const article = await user.createArticle({title: 'Hello', content: 'Hello'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .put(`/admin/api/articles/${article.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({title: 'Hello Edited', content: 'Hello Edited'})
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.title).to.eql('Hello Edited');
        expect(res.body.data.content).to.eql('Hello Edited');
      });
      it('It should NOT UPDATE a article if the logged user is not the owner', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const other = await User.create({username: 'beta', password: '12345678'});
        const article = await other.createArticle({title: 'Hello', content: 'Hello'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .put(`/admin/api/articles/${article.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({title: 'Hello Edited', content: 'Hello Edited'})
        expect(res.status).to.eql(403);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT UPDATE a article if token is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const article = await user.createArticle({title: 'Hello', content: 'Hello'});
        const res = await request(server)
          .put(`/admin/api/articles/${article.id}`)
          .set('Content-Type', 'application/json')
          .send({title: 'Hello', content: 'Hello'})
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /DELETE /admin/api/articles/:id
     */
     
    describe('/DELETE /admin/api/articles/:id', () => {
      it('It should DELETE a article', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const article = await user.createArticle({title: 'Hello', content: 'Hello'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .delete(`/admin/api/articles/${article.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send()
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        
        const articleCount = await user.countArticles();
        expect(articleCount).to.eql(0);
      });
      it('It should NOT DELETE a article if the logged user is not the owner', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const other = await User.create({username: 'beta', password: '12345678'});
        const article = await other.createArticle({title: 'Hello', content: 'Hello'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .delete(`/admin/api/articles/${article.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send()
        expect(res.status).to.eql(403);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT DELETE a article if token is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const article = await user.createArticle({title: 'Hello', content: 'Hello'});
        const res = await request(server)
          .delete(`/admin/api/articles/${article.id}`)
          .set('Content-Type', 'application/json')
          .send({title: 'Hello', content: 'Hello'})
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
    /**
     * /GET /admin/api/articles/slug/:slug
     */
     
    describe('/GET /admin/api/articles/slug/:slug', () => {
      it('It should get a articles by given SLUG', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const article = await user.createArticle({title: 'Hello', content: 'Hello'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get(`/admin/api/articles/slug/${article.slug}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('ok');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.title).to.eql('Hello');
      });
      it('It should NOT get a article if SLUG is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const article = await user.createArticle({title: 'Hello', content: 'Hello'});
        const token = await jwt.generateToken({id:user.id});
        const res = await request(server)
          .get(`/admin/api/articles/slug/abcdefg`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
      it('It should NOT get a article if token is INVALID', async () => {
        const user = await User.create({username: 'alpha', password: '12345678'});
        const res = await request(server)
          .get(`/admin/api/articles/slug/abcdefg`)
          .set('Accept', 'application/json')
        expect(res.status).to.eql(401);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.eql('error');
      });
    });
    
  });

});
