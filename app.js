require('dotenv').config();


/* init database */
const { Sequelize } = require('sequelize');
const cls = require('cls-hooked');
const namespace = cls.createNamespace('database-transaction');
Sequelize.useCLS(namespace);

const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, require('./config/db'))
  : new Sequelize(require('./config/db'));
const models = require('./models')(sequelize);
sequelize.authenticate()
  .then(async () => {
    const isUsersEmpty = await models.User.count();
    if (isUsersEmpty === 0) {
      console.log('Creating admin account...');
      await sequelize.transaction(async () => {
        await models.User.create({username: 'admin', password: 'admin'});
      });
    }
  })
  .catch(err => console.error(err));


/* init http server */
const express = require('express');
const server = express();

server.set('trust proxy', 1);
server.use(require('helmet')());
server.use(require('cors')());
server.use(require('body-parser').urlencoded({ extended: false }));
server.use(require('body-parser').json());

// init routes
server.use('/admin', require('./admin-api')(models, sequelize));
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
