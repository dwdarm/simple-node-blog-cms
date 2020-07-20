const express = require('express');
const cookieParser = require('cookie-parser');

module.exports = (models, mail, config) => {
  const router = express.Router();
  
  router.use(cookieParser());
  router.use('/forgot-password', require('./routes/forgot-password')(models, mail, config));
  router.use('/reset-password', require('./routes/reset-password')(models, mail, config));
  
  return router;
}
