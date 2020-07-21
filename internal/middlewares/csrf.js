const csrf = require('csurf');

const csrfProtection = csrf({ cookie: true });

const trimCsrf = (req, res, next) => {
  if (typeof req.body._csrf === 'string') {
    req.body._csrf = req.body._csrf.trim();
  }
    
  next();
}

module.exports = { csrfProtection, trimCsrf }
