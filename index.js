require('dotenv').config();

const internal = require('./internal');

internal.server.listen(process.env.PORT || 3000, err => {
  if (err) {
    return console.error(err);
  }
});

module.exports = internal;
