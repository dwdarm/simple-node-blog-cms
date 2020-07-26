const csrf = require('csurf');

const CsrfMiddleware = () => ({
  init: csrf({ cookie: true }),
  
  trim(req, res, next) {
    if (typeof req.body._csrf === 'string') {
      req.body._csrf = req.body._csrf.trim();
    }
    
    next();
  }
});

module.exports = CsrfMiddleware;
