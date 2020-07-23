const { verifyToken } = require('../utils/jwt');
const { sendUnauthorizedError } = require('../utils/error-response');

const AuthenticationMiddleware = ({ db }) => ({
  
  async authenticate(req, res, next) {
    try {
      const authHeader = req.get('Authorization');
      if (!authHeader) {
        return sendUnauthorizedError(res);
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return sendUnauthorizedError(res);
      }
  
      const decoded = await verifyToken(token);
      if (!decoded) {
        return sendUnauthorizedError(res);
      }
  
      const user = await db.User.getById(decoded.id);
      if (!user) {
        return sendUnauthorizedError(res);
      }
  
      req.loggedUser = user;
      next();
    
    } catch(err) {
      sendUnauthorizedError(res);
    }
  }
  
});

module.exports = AuthenticationMiddleware;
