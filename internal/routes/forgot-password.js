const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { csrfProtection, trimCsrf } = require('../middlewares/csrf');

module.exports = ({ User, PasswordToken }, mail, config) => {
  const router = express.Router();
  
  router.get('/', csrfProtection, async (req, res, next) => {
    try {
      res.render('forgot-password', { csrfToken: req.csrfToken() });
    } catch(err) {
      next(err);
    } 
  });
  
  router.post('/', trimCsrf, csrfProtection, async (req, res, next) => {
    try {
      const user = await User.findOne({ 
        where: { username: req.body.username || '' }
      });
      if (!user) {
        return res.status(404).render('notification', { 
          message: 'User not found',
          status: 'error'
        });
      }
      
      const uuid = uuidv4();
      const passwordToken = await user.getPasswordToken();
      if (passwordToken) {
        passwordToken.token = uuid;
        await passwordToken.save();
      } 
      else {
        await user.createPasswordToken({ token: uuid });
      }
     
      const reset_url = `${config.url_base}/reset-password/${user.id}/${uuid}`;
      await mail.sendMail({
        to: user.email || 'user@example.com',
        subject: 'Reset password',
        html: `click this link to reset your password: <a href=${reset_url}>${reset_url}</a>`
      });
      
      res.render('notification', { 
        message: 'Reset password link sent to your email',
        status: 'success'
      });
    
    } catch(err) {
      next(err);
    } 
  });
  
  return router;
}
