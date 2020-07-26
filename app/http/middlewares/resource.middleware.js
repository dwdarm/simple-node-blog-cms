const errorResponse = require('../../utils/error-response');

const ResourceMiddleware = (db) => (Resource) => ({
  
  async getResource(req, res, next) {
    
    if (Resource === 'User') {
      if (req.params.id === 'me') {
        if (!req.loggedUser) { return sendNotFoundError(res); }
      
        return res.send({ 
          status: 'ok', 
          data: req.loggedUser.toJSON(req.loggedUser) 
        });
      }
    }
    
    if (!parseInt(req.params.id)) {
      return errorResponse.sendNotFoundError(res);
    }
    
    try {
      const result = await db[Resource].getById(req.params.id);
      if (!result) {
        return errorResponse.sendNotFoundError(res);
      }
      
      req[Resource.toLowerCase()] = result; 
      next();
      
    } catch(err) {
      next(err);
    } 
  },
  
  isOwner(req, res, next) {
    const resource = req[Resource.toLowerCase()]
    
    if (Resource === 'User') {
      if (req.loggedUser.id !== resource.id) {
        return errorResponse.sendForbiddenError(res);
      }
    } else {
      if (req.loggedUser.id !== resource.User.id) {
        return errorResponse.sendForbiddenError(res);
      }
    }
    
    next();
  }
  
});

module.exports = ResourceMiddleware;
