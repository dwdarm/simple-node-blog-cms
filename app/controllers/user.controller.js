const { 
  sendNotFoundError, 
  sendBadRequestError,
  sendForbiddenError 
} = require('../utils/error-response');

const UserController = ({ db }) => ({
  async getAll(req, res, next) {
    const { User, sequelize } = db;
    
    try {
      const { count, rows } = await User.findAndCountAll();
      res.send({ 
        status: 'ok', 
        total: count, 
        data: rows.map(e => e.toJSON(req.loggedUser))
        });
    } catch(err) {
      next(err);
    } 
  },
  
  async getById(req, res, next) {
    if (req.params.id === 'me') {
      if (!req.loggedUser) {
        return sendNotFoundError(res);
      }
      
      return res.send({ 
        status: 'ok', 
        data: req.loggedUser.toJSON(req.loggedUser) 
      });
    }
    
    if (!parseInt(req.params.id)) {
      return sendNotFoundError(res);
    }
    
    const { User, sequelize } = db;
    
    try {
      const user = await User.getById(req.params.id);
      if (!user) {
        return sendNotFoundError(res);
      }
      
      res.send({ 
        status: 'ok', 
        data: user.toJSON(req.loggedUser) 
      });
    } catch(err) {
      next(err);
    } 
  },
  
  async getByUsername(req, res, next) {
    const { User, sequelize } = db;
    
    try {
      const user = await User.getByUsername(req.params.username);
      if (!user) {
        return sendNotFoundError(res);
      }
      
      res.send({ 
        status: 'ok', 
        data: user.toJSON(req.loggedUser) 
      });
    
    } catch(err) {
      next(err);
    } 
  },
  
  async update(req, res, next) {
    if (!parseInt(req.params.id)) {
      return sendNotFoundError(res);
    }
    
    const { User, sequelize } = db;
    
    try {
      const user = await User.getById(req.params.id);
      if (!user) {
        return sendNotFoundError(res);
      }
      
      if (req.loggedUser.id !== user.id) {
        return sendForbiddenError(res);
      }
      
      await sequelize.transaction(async () => {
        await user.change(req.body);
      });
      
      res.send({ 
        status: 'ok', 
        data: user.toJSON(req.loggedUser) 
      });
      
    } catch(err) {
      if (err.errors.length > 0) {
        if (err.errors[0].path === 'username') {
          return sendBadRequestError('Username is already used')(res);
        }
      }
      next(err);
    } 
  },
  
});

module.exports = UserController;
