const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const Mail = require('../../utils/mail');

const PasswordController = ({ User }) => {
  const mail = new Mail({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD
  });
  
  const sender = process.env.MAIL_SENDER;
  const url = process.env.APP_URL;
  
  return {
    
    async getForgotPassword(req, res, next) {
      try {
        res.render('admin/forgot-password', { csrfToken: req.csrfToken() });
      } catch(err) {
        next(err);
      } 
    },
  
    async postForgotPassword(req, res, next) {
      try {
        const user = await User.findOne({ 
          where: { username: req.body.username || '' }
        });
        if (!user) {
          return res.status(404).render('admin/notification', { 
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
     
        const reset_url = `${url}/reset-password/${user.id}/${uuid}`;
        await mail.send({
          from: sender,
          to: user.email,
          subject: 'Reset password',
          html: `click this link to reset your password: <a href=${reset_url}>${reset_url}</a>`
        });
      
        res.render('admin/notification', { 
          message: 'Reset password link sent to your email',
          status: 'success'
        });
    
      } catch(err) {
        next(err);
      } 
    },
  
    async getResetPassword(req, res, next) {
      try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
          return res.status(400).render('admin/notification', { 
            message: 'Invalid token',
            status: 'error'
          });
        }
      
        const passwordToken = await user.getPasswordToken();
        if (!passwordToken) {
          return res.status(400).render('admin/notification', { 
            message: 'Invalid token',
            status: 'error'
          });
        } 
     
        const isValid = await bcrypt.compare(req.params.token, passwordToken.token);
        if (!isValid) {
          return res.status(400).render('admin/notification', { 
            message: 'Invalid token',
            status: 'error'
          });
        }
      
        res.render('admin/reset-password', {
          userId: req.params.id,
          token: req.params.token,
          csrfToken: req.csrfToken()
        });
    
      } catch(err) {
        next(err);
      }
    },
  
    async postResetPassword(req, res, next) {
      try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
          return res.status(400).render('admin/notification', { 
            message: 'Invalid token',
            status: 'error'
          });
        }
      
        const passwordToken = await user.getPasswordToken();
        if (!passwordToken) {
          return res.status(400).render('admin/notification', { 
            message: 'Invalid token',
            status: 'error'
          });
        } 
     
        const isValid = await bcrypt.compare(req.params.token, passwordToken.token);
        if (!isValid) {
          return res.status(400).render('admin/notification', { 
            message: 'Invalid token',
            status: 'error'
          });
        }
      
        if (typeof req.body.password !== 'string' || req.body.password.length === 0) {
          return res.status(400).render('admin/notification', { 
            message: 'Password is too short (minimum 4 characters)',
            status: 'error'
          });
        }
      
        user.password = req.body.password;
        await user.save();
        await user.setPasswordToken(null);
      
        res.render('admin/notification', { 
          message: 'Password has been changed, now you can login',
          status: 'success'
        });
    
      } catch(err) {
        next(err);
      } 
    },
  }
  
}

module.exports = PasswordController;
