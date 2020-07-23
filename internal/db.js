const db = require('../app/models');

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
  
module.exports = db;
