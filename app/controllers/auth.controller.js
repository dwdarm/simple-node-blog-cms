const { 
  sendNotFoundError, 
  sendBadRequestError,
  sendForbiddenError 
} = require('../utils/error-response');
const { generateToken } = require('../utils/jwt');

const AuthController = ({ db }) => ({
  async login(req, res, next) {
    const { User } = db;
    const username = req.body.username;
    const password = req.body.password;
    
    try {
      const user = await User.getByUsername(username);
      if (!user) { 
        return sendNotFoundError(res);
      }
      
      const isValid = await user.isPasswordValid(password);
      if (!isValid) {
        return sendBadRequestError('Invalid password')(res);
      }
      
      const token = await generateToken({id:user.id});
      res.send({ status: 'ok', data: { token } });
    
    } catch(err) {
      next(err);
    } 
  }
  
});

module.exports = AuthController;
