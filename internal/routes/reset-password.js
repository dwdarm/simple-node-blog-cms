const express = require('express');
const bcrypt = require('bcrypt');
const csrf = require('csurf');

module.exports = ({ User, PasswordToken }, mail, config) => {
  const router = express.Router();
  const csrfProtection = csrf({ cookie: true })
  
  const trimCsrf = (req, res, next) => {
    if (typeof req.body._csrf === 'string') {
      req.body._csrf = req.body._csrf.trim();
    }
    
    next();
  }
  
  router.get('/:id/:token', csrfProtection, async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(400).render('notification', { 
          message: 'Invalid token',
          status: 'error'
        });
      }
      
      const passwordToken = await user.getPasswordToken();
      if (!passwordToken) {
        return res.status(400).render('notification', { 
          message: 'Invalid token',
          status: 'error'
        });
      } 
     
      const isValid = await bcrypt.compare(req.params.token, passwordToken.token);
      if (!isValid) {
        return res.status(400).render('notification', { 
          message: 'Invalid token',
          status: 'error'
        });
      }
      
      res.render('reset-password', {
        userId: req.params.id,
        token: req.params.token,
        csrfToken: req.csrfToken()
      });
    
    } catch(err) {
      next(err);
    } 
  });
  
  router.post('/:id/:token', trimCsrf, csrfProtection, async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(400).render('notification', { 
          message: 'Invalid token',
          status: 'error'
        });
      }
      
      const passwordToken = await user.getPasswordToken();
      if (!passwordToken) {
        return res.status(400).render('notification', { 
          message: 'Invalid token',
          status: 'error'
        });
      } 
     
      const isValid = await bcrypt.compare(req.params.token, passwordToken.token);
      if (!isValid) {
        return res.status(400).render('notification', { 
          message: 'Invalid token',
          status: 'error'
        });
      }
      
      if (typeof req.body.password !== 'string' || req.body.password.length === 0) {
        return res.status(400).render('notification', { 
          message: 'Password is too short (minimum 4 characters)',
          status: 'error'
        });
      }
      
      user.password = req.body.password;
      await user.save();
      await user.setPasswordToken(null);
      
      res.status(400).render('notification', { 
        message: 'Password has been changed, now you can login',
        status: 'success'
      });
    
    } catch(err) {
      next(err);
    } 
  });
  
  return router;
}
