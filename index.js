require('dotenv').config();

const internal = require('./internal').init();

internal.db.sequelize.authenticate().catch(err => console.error(err));

internal.server.listen(process.env.APP_PORT || process.env.PORT || 3000, err => {
  if (err) {
    return console.error(err);
  }
});

module.exports = internal;
