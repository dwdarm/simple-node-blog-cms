module.exports = (req, res, next) => {
  if (req.loggedUser.role !== 'admin') {
    return res.status(403).send({
      status: 'error',
      message: 'Forbidden access'
    });
  }
  
  next();
}
