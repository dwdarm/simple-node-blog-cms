const errorResponse = require('../../utils/error-response');

const UserController = ({ User, sequelize }) => ({
  
  async getAll(req, res, next) {
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
  
  getById(req, res, next) {
    try {
      res.send({ 
        status: 'ok', 
        data: req.user.toJSON(req.loggedUser) 
      });
    } catch(err) {
      next(err);
    } 
  },
  
  async getByUsername(req, res, next) {
    try {
      const user = await User.getByUsername(req.params.username);
      if (!user) {
        return errorResponse.sendNotFoundError(res);
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
    try {
      await sequelize.transaction(async () => {
        await req.user.change(req.body);
      });
      
      res.send({ 
        status: 'ok', 
        data: req.user.toJSON(req.loggedUser) 
      });
      
    } catch(err) {
      if (err.errors.length > 0) {
        if (err.errors[0].path === 'username') {
          return errorResponse.sendBadRequestError('Username is already used')(res);
        }
      }
      next(err);
    } 
  },
  
});

module.exports = UserController;
