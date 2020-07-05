const express = require('express');

module.exports = ({User}) => {
  const router = express.Router();
  
  const getUserById = async (req, res, next) => {
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
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      });
      res.send({ status: 'ok', data: users });
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
      await user.save();
      
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
