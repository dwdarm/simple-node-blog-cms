const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const PasswordController = ({ db, mail, config }) => ({
  
  async getForgotPassword(req, res, next) {
    try {
      res.render('forgot-password', { csrfToken: req.csrfToken() });
    } catch(err) {
      next(err);
    } 
  },
  
  async postForgotPassword(req, res, next) {
    const { User } = db;
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
        to: 'user@example.com',
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
  },
  
  async getResetPassword(req, res, next) {
    const { User } = db;
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
  },
  
  async postResetPassword(req, res, next) {
    const { User } = db;
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
  },
  
});

module.exports = PasswordController;
