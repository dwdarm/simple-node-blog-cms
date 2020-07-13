require('dotenv').config();

/* init database */
const db = require('./models');
db.sequelize.authenticate()
  .then(async () => {
    const usersCount = await db.User.count();
    if (usersCount === 0) {
      await db.sequelize.transaction(async () => {
        await db.User.create({ username: 'admin', password: 'admin' });
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
server.use('/admin', require('./admin-api')(db));
server.use('/client', require('./client-api')(db));

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

module.exports = { server, db };
