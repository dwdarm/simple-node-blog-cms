const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('../jwt');

module.exports = ({User}) => {
  const router = express.Router();
  
  router.post('/', async (req, res, next) => {
    try {
      const user = await User.findOne({ where: { username: req.body.username || '' } });
      if (!user) {
        return res.status(404).send({
          status: 'error',
          message: 'User is not found'
        });
      }
      
      const isValid = await bcrypt.compare(req.body.password, user.password);
      if (!isValid) {
        return res.status(400).send({
          status: 'error',
          message: 'Invalid password'
        });
      }
      
      const token = await jwt.generateToken({id:user.id});
      res.send({
        status: 'ok',
        data: { token }
      });
    
    } catch(err) {
      next(err);
    } 
  });
  
  return router;
}
