const express = require('express');
const path = require('path');

module.exports = (models, mail, config) => {
  const router = express.Router();
  const authentication = require('./middlewares/authentication')(models.User);
  
  router.use('/api/auth', require('./routes/auth')(models, mail, config));
  router.use('/api/users', authentication, require('./routes/user')(models));
  router.use('/api/articles', authentication, require('./routes/article')(models));
  router.use('/api/categories', authentication, require('./routes/category')(models));
  router.use('/api/tags', authentication, require('./routes/tag')(models));
  
  router.get('/api/*', authentication, (req, res) => res.sendStatus(404));
  router.get('/api', authentication, (req, res) => res.sendStatus(404));
  
  return router;
}
