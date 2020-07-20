require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.js')[env];
const path = require('path');

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
const mail = require('./mail');

server.set('trust proxy', 1);
server.set('view engine', 'ejs');
server.use(require('helmet')());
server.use(require('cors')());
server.use(require('body-parser').urlencoded({ extended: false }));
server.use(require('body-parser').json());

// init routes
server.use('/admin', require('./admin-api')(db, mail, config));
server.use('/client', require('./client-api')(db));

// server static
server.use(express.static(path.join(__dirname, './admin-client/dist'), {index:false}));
server.use(express.static(path.join(__dirname, './public'), {index:false}));
server.use('/', require('./internal')(db, mail, config));

server.get('*', (req, res) => {
  res.sendFile('index.html', {
    root: path.join(__dirname, './admin-client/dist')
  });
});

// log error
server.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }
  
  next(err);
});

server.use((err, req, res, next) => res.sendStatus(500));

server.listen(process.env.PORT || 3000, err => {
  if (err) {
    return console.error(err);
  }
});

module.exports = { server, db };
