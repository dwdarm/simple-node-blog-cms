require('dotenv').config();

const express = require('express');
const server = express();
const { Sequelize } = require('sequelize');

/* init database */
const sequelize = new Sequelize(process.env.DATABASE_URL || require('./config/db'));
const models = require('./models')(sequelize);
sequelize.authenticate()
  .then(async () => {
    const admin = await models.User.findOne({where: {username: 'admin'}});
    if (!admin) {
      console.log('Creating admin account...');
      await models.User.create({username: 'admin', password: 'admin'});
    }
  })
  .catch(err => console.error(err));

/* init http server */
server.set('trust proxy', 1);
server.use(require('helmet')());
server.use(require('cors')());
server.use(require('body-parser').urlencoded({ extended: false }));
server.use(require('body-parser').json());

// init routes
server.use('/admin', require('./admin-api')(models));
server.use('/client', require('./client-api')(models));

// log error
server.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }
  
  next(err);
});

server.use((err, req, res, next) => res.sendStatus(500));

server.get('*', (req, res) => res.sendStatus(404));

server.listen(process.env.PORT || 3000, err => {
  if (err) {
    return console.error(err);
  }
});

module.exports = { server, models };
