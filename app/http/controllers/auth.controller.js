const errorResponse = require('../../utils/error-response');
const jwt = require('../../utils/jwt');

const AuthController = ({ User }) => ({
  async login(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    
    try {
      const user = await User.getByUsername(username);
      if (!user) { 
        return errorResponse.sendNotFoundError(res);
      }
      
      const isValid = await user.isPasswordValid(password);
      if (!isValid) {
        return errorResponse.sendBadRequestError('Invalid password')(res);
      }
      
      const token = await jwt.generateToken({id:user.id});
      res.send({ status: 'ok', data: { token } });
    
    } catch(err) {
      next(err);
    } 
  }
  
});

module.exports = AuthController;
