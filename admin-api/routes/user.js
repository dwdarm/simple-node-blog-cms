const express = require('express');
const DEFAULT_LIMIT = 20;

module.exports = ({User, sequelize}) => {
  const router = express.Router();
  
  const getUserById = async (req, res, next) => {
    
    if (req.params.id === 'me') {
        req.user = { ...req.loggedUser.toJSON(), password: undefined };
        return next();
      }
    
    if (!parseInt(req.params.id)) {
      return res.status(404).send({
        status: 'error',
        message: 'User not found'
      });
    }
    
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      });
      if (!user) {
        return res.status(404).send({
          status: 'error',
          message: 'User not found'
        });
      }
      
      req.user = user;
      next();
    } catch(err) {
      next(err);
    }
  }
  
  /**
   * /GET /users
   */
   
  router.get('/', async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
      const offset = ((parseInt(req.query.page) || 1) - 1) * limit;
      
      const order = []
      if (req.query.sort === 'username_asc') {
        order.push(['username', 'ASC']);
      } 
      else if (req.query.sort === 'username_desc') {
        order.push(['username', 'DESC']);
      } 
      
       const { count, rows } = await User.findAndCountAll({
        order, limit, offset,
        attributes: { exclude: ['password'] }
      });
      res.send({ status: 'ok', total: count, data: rows });
    } catch(err) {
      next(err);
    } 
  });
  
  /**
   * /GET /users/:id
   */
  
  router.get('/:id', getUserById, async (req, res, next) => {
    try {
      res.send({ status: 'ok', data: req.user });
    } catch(err) {
      next(err);
    } 
  });
  
  /**
   * /PUT /users/:id
   */
  
  router.put('/:id', getUserById, async (req, res, next) => {
    try {
      if (req.loggedUser.id !== req.user.id) {
        return res.status(403).send({
          status: 'error',
          message: 'Forbidden access'
        });
      }
      
      const { user } = req;
      const { username, password, fullName, urlToAvatar, about, email } = req.body;
      if ((typeof username === 'string') && (username !== user.username)) {
        user.username = username;
      }
      if (typeof password === 'string') { user.password = password; }
      if (typeof fullName === 'string') { user.fullName = fullName; }
      if (typeof urlToAvatar === 'string') { user.urlToAvatar = urlToAvatar; }
      if (typeof about === 'string') { user.about = about; }
      if (typeof email === 'string') { user.email = email; }
      
      await sequelize.transaction(async () => {
        await user.save();
      });
      
      res.send({ status: 'ok', data: user });
      
    } catch(err) {
      if (err.errors.length > 0) {
        if (err.errors[0].path === 'username') {
          return res.status(403).send({
            status: 'error',
            message: 'Username is already used'
          });
        }
      }
      next(err);
    } 
  });
  
  /**
   * /GET /users/username/:username
   */
  
  router.get('/username/:username', async (req, res, next) => {
    try {
      const user = await User.findOne({ 
        where: { username: req.params.username || '' },
        attributes: { exclude: ['password'] }
      });
      if (!user) {
        return res.status(404).send({
          status: 'error',
          message: 'User not found'
        });
      }
      
      res.send({ status: 'ok', data: user });
    
    } catch(err) {
      next(err);
    } 
  });
  
  return router;
}
