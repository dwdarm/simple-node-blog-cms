const express = require('express');
const path = require('path');

module.exports = {
  
  init: (server, { controllers, middlewares }) => {
    
    const { 
      AuthenticationMiddleware, 
      UserRoleMiddleware,
      CsrfMiddleware,
      ResourceMiddleware 
    } = middlewares;
    
    const { 
      UserController, 
      ArticleController,
      CategoryController,
      TagController,
      AuthController,
      PasswordController,
      SiteController
    } = controllers;
    
    //server.set('trust proxy', 1);
    server.set('view engine', 'ejs');
    server.set('views', path.join(__dirname, '../views'));
  
    //server.use(require('cors')());
    server.use(require('helmet')());
    server.use(require('body-parser').urlencoded({ extended: false }));
    server.use(require('body-parser').json());
    server.use(require('cookie-parser')());
    server.use(express.static(path.join(__dirname, '../public'), {index:false}));
    
    const UserMiddleware = ResourceMiddleware('User');
    const ArticleMiddleware = ResourceMiddleware('Article');
    const CategoryMiddleware = ResourceMiddleware('Category');
    const TagMiddleware = ResourceMiddleware('Tag');
  
    // Admin API
    server.post('/admin/api/auth', AuthController.login);
    
    server.use('/admin/api', AuthenticationMiddleware.authenticate);
    
    server.get('/admin/api/users', UserController.getAll);
    server.get('/admin/api/users/:id', UserMiddleware.getResource, UserController.getById);
    server.get('/admin/api/users/username/:username', UserController.getByUsername);
    server.put('/admin/api/users/:id', UserMiddleware.getResource, UserMiddleware.isOwner, UserController.update);
    
    server.get('/admin/api/articles', ArticleController.getAll);
    server.post('/admin/api/articles', ArticleController.create);
    server.get('/admin/api/articles/:id', ArticleMiddleware.getResource, ArticleController.getById);
    server.get('/admin/api/articles/slug/:slug', ArticleController.getBySlug);
    server.put('/admin/api/articles/:id', ArticleMiddleware.getResource, ArticleMiddleware.isOwner, ArticleController.update);
    server.delete('/admin/api/articles/:id', ArticleMiddleware.getResource, ArticleMiddleware.isOwner, ArticleController.delete);
    
    server.get('/admin/api/categories', CategoryController.getAll);
    server.post('/admin/api/categories', CategoryController.create);
    server.get('/admin/api/categories/:id', CategoryMiddleware.getResource, CategoryController.getById);
    server.get('/admin/api/categories/slug/:slug', CategoryController.getBySlug);
    server.put('/admin/api/categories/:id', CategoryMiddleware.getResource, CategoryController.update);
    server.delete('/admin/api/categories/:id', CategoryMiddleware.getResource, CategoryController.delete);
    
    server.get('/admin/api/tags', TagController.getAll);
    server.post('/admin/api/tags', TagController.create);
    server.get('/admin/api/tags/:id', TagMiddleware.getResource, TagController.getById);
    server.get('/admin/api/tags/slug/:slug', TagController.getBySlug);
    server.put('/admin/api/tags/:id', TagMiddleware.getResource, TagController.update);
    server.delete('/admin/api/tags/:id', TagMiddleware.getResource, TagController.delete);
  
    server.get('/admin/api/*', (req, res) => res.sendStatus(404));
    server.get('/admin/api', (req, res) => res.sendStatus(404));
    
    server.get('/admin', (req, res) => {
      res.sendFile('index.html', {
        root: path.join(__dirname, '../public/admin')
      });
    });
    
    server.get('/admin/*', (req, res) => {
      res.sendFile('index.html', {
        root: path.join(__dirname, '../public/admin')
      });
    });
    
    // Client API
    server.get('/client/api/users', UserController.getAll);
    server.get('/client/api/users/:id', UserMiddleware.getResource, UserController.getById);
    server.get('/client/api/users/username/:username', UserController.getByUsername);

    server.get('/client/api/articles', ArticleController.getAll);
    server.get('/client/api/articles/:id', ArticleMiddleware.getResource, ArticleController.getById);
    server.get('/client/api/articles/slug/:slug', ArticleController.getBySlug);
    
    server.get('/client/api/categories', CategoryController.getAll);
    server.get('/client/api/categories/:id', CategoryMiddleware.getResource, CategoryController.getById);
    server.get('/client/api/categories/slug/:slug', CategoryController.getBySlug);
    
    server.get('/client/api/tags', TagController.getAll);
    server.get('/client/api/tags/:id', TagMiddleware.getResource, TagController.getById);
    server.get('/client/api/tags/slug/:slug', TagController.getBySlug);
  
    server.get('/client/api/*', (req, res) => res.sendStatus(404));
    server.get('/client/api', (req, res) => res.sendStatus(404));
    
    
    // Password
    server.get(
      '/forgot-password', 
      CsrfMiddleware.init,
      PasswordController.getForgotPassword
    );
    
    server.post(
      '/forgot-password', 
      CsrfMiddleware.trim,
      CsrfMiddleware.init,
      PasswordController.postForgotPassword
    );
    
    server.get(
      '/reset-password/:id/:token',
      CsrfMiddleware.init, 
      PasswordController.getResetPassword
    );
    
    server.post(
      '/reset-password/:id/:token',
      CsrfMiddleware.trim,
      CsrfMiddleware.init,
      PasswordController.postResetPassword
    );
    
    
    // site 
    server.get('/', SiteController.index);
  
    // log error
    server.use((err, req, res, next) => {
      if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
      }
  
      next(err);
    });

    server.use((err, req, res, next) => res.sendStatus(500));
    
  }
  
}
