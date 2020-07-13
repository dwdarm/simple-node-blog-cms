const express = require('express');
const path = require('path');

module.exports = (models, sequelize) => {
  const router = express.Router();
  const authentication = require('./middlewares/authentication')(models.User);
  
  router.use(express.static(path.join(__dirname, '../admin-client/dist'), {index:false}));
  router.use('/api/auth', require('./routes/auth')(models));
  router.use('/api/users', authentication, require('./routes/user')(models, sequelize));
  router.use('/api/articles', authentication, require('./routes/article')(models, sequelize));
  router.use('/api/categories', authentication, require('./routes/category')(models, sequelize));
  router.use('/api/tags', authentication, require('./routes/tag')(models, sequelize));
  
  router.get('/api/*', authentication, (req, res) => res.sendStatus(404));
  router.get('/api', authentication, (req, res) => res.sendStatus(404));
  
  router.get('*', (req, res) => res.sendFile('index.html', {root: path.join(__dirname, '../admin-client/dist')}));
  
  return router;
}
