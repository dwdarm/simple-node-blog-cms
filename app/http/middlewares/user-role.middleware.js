const { sendForbiddenError } = require('../../utils/error-response');

const UserRoleMiddleware = () => ({
  isAdmin(req, res, next) {
    if (req.loggedUser.role !== 'admin') {
      return sendForbiddenError(res);
    }
  
    next();
  }
});

module.exports = UserRoleMiddleware;
