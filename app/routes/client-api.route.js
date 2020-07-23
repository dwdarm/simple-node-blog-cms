const ClientApiRoute = ({ router, controllers }) => {
  const { UserController, ArticleController, CategoryController, TagController } = controllers;
    
  router.get('/client/api/users', UserController.getAll);
  router.get('/client/api/users/:id', UserController.getById);
  router.get('/client/api/users/username/:username', UserController.getByUsername);
    
  router.get('/client/api/articles', ArticleController.getAll);
  router.get('/client/api/articles/:id', ArticleController.getById);
  router.get('/client/api/articles/slug/:slug', ArticleController.getBySlug);
    
  router.get('/client/api/categories', CategoryController.getAll);
  router.get('/client/api/categories/:id', CategoryController.getById);
  router.get('/client/api/categories/slug/:slug', CategoryController.getBySlug);
    
  router.get('/client/api/tags', TagController.getAll);
  router.get('/client/api/tags/:id', TagController.getById);
  router.get('/client/api/tags/slug/:slug', TagController.getBySlug);
}

module.exports = ClientApiRoute;
