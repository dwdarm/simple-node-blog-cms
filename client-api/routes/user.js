const express = require('express');
const DEFAULT_LIMIT = 20;

module.exports = ({User}) => {
  const router = express.Router();
  
  const getUserById = async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
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
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
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
   * /GET /users/username/:username
   */
  
  router.get('/username/:username', async (req, res, next) => {
    try {
      const user = await User.findOne({ 
        where: { username: req.params.username || '' },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
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
