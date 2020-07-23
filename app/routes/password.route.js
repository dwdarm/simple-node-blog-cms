const PasswordRoute = ({ router, controllers, middlewares }) => {
  const { CsrfMiddleware } = middlewares;
  const { PasswordController } = controllers;
    
  router.get(
    '/forgot-password', 
    CsrfMiddleware.init,
    PasswordController.getForgotPassword
  );
    
  router.post(
    '/forgot-password', 
    CsrfMiddleware.trim,
    CsrfMiddleware.init,
    PasswordController.postForgotPassword
  );
    
  router.get(
    '/reset-password/:id/:token',
    CsrfMiddleware.init, 
    PasswordController.getResetPassword
  );
    
  router.post(
    '/reset-password/:id/:token',
    CsrfMiddleware.trim,
    CsrfMiddleware.init,
    PasswordController.postResetPassword
  );

}

module.exports = PasswordRoute;
