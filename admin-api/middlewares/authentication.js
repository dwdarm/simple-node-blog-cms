const { verifyToken } = require('../jwt');

const unauthorizedResponse = res => {
  res.status(401).send({
    status: 'error',
    message: 'This method required authorized access'
  });
}

module.exports = (User) => async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      return unauthorizedResponse(res);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return unauthorizedResponse(res);
    }
  
    const decoded = await verifyToken(token);
    if (!decoded) {
      return unauthorizedResponse(res);
    }
  
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).send({
        status: 'error',
        message: 'User is not found'
      });
    }
  
    req.loggedUser = user;
    next();
  } catch(err) {
    unauthorizedResponse(res);
  }
}
