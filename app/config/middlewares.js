const path = require('path');

const middlewares = ({ middlewares, server }) => {
  server.set('trust proxy', 1);
  server.set('view engine', 'ejs');
  server.set('views', path.join(__dirname, '../views'));
  
  server.use(require('helmet')());
  server.use(require('cors')());
  server.use(require('body-parser').urlencoded({ extended: false }));
  server.use(require('body-parser').json());
  server.use(require('cookie-parser')());
}

module.exports = middlewares;
