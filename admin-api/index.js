const express = require('express');

module.exports = (models) => {
  const router = express.Router();
  const authentication = require('./middlewares/authentication')(models.User);
  
  router.use('/api/auth', require('./routes/auth')(models));
  
  router.use(authentication);
  router.use('/api/users', require('./routes/user')(models));
  
  router.get('*', (req, res) => res.sendStatus(404));
  
  return router;
}
