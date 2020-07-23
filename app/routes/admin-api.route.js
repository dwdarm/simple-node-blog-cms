const AdminApiRoute = data => {
  const { router, controllers, middlewares } = data;
  const { AuthenticationMiddleware, UserRoleMiddleware } = middlewares;
  const { 
    UserController, 
    ArticleController,
    CategoryController,
    TagController,
    AuthController
  } = controllers;
    
  router.post('/admin/api/auth', AuthController.login);
    
  router.use('/admin/api', AuthenticationMiddleware.authenticate);
    
  router.get('/admin/api/users', UserController.getAll);
  router.get('/admin/api/users/:id', UserController.getById);
  router.get('/admin/api/users/username/:username', UserController.getByUsername);
  router.put('/admin/api/users/:id', UserController.update);
    
  router.get('/admin/api/articles', ArticleController.getAll);
  router.post('/admin/api/articles', ArticleController.create);
  router.get('/admin/api/articles/:id', ArticleController.getById);
  router.get('/admin/api/articles/slug/:slug', ArticleController.getBySlug);
  router.put('/admin/api/articles/:id', ArticleController.update);
  router.delete('/admin/api/articles/:id', ArticleController.delete);
    
  router.get('/admin/api/categories', CategoryController.getAll);
  router.post('/admin/api/categories', CategoryController.create);
  router.get('/admin/api/categories/:id', CategoryController.getById);
  router.get('/admin/api/categories/slug/:slug', CategoryController.getBySlug);
  router.put('/admin/api/categories/:id', CategoryController.update);
  router.delete('/admin/api/categories/:id', CategoryController.delete);
    
  router.get('/admin/api/tags', TagController.getAll);
  router.post('/admin/api/tags', TagController.create);
  router.get('/admin/api/tags/:id', TagController.getById);
  router.get('/admin/api/tags/slug/:slug', TagController.getBySlug);
  router.put('/admin/api/tags/:id', TagController.update);
  router.delete('/admin/api/tags/:id', TagController.delete);
}

module.exports = AdminApiRoute;
