const error = ({ server }) => {
  
  // log error
  server.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(err.stack);
    }
  
    next(err);
  });

  server.use((err, req, res, next) => res.sendStatus(500));
  
}

module.exports = error;
