const express = require('express');

module.exports = (models) => {
  const router = express.Router();
  
  router.use('/api/auth', require('./routes/auth')(models));
  
  router.get('*', (req, res) => res.sendStatus(404));
  
  return router;
}
