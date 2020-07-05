const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = sequelize => sequelize.define('User', {
  
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  role: {
    type: DataTypes.STRING,
    defaultValue: "admin"
  },
  
  fullName: {
    type: DataTypes.STRING
  },
  
  urlToAvatar: {
    type: DataTypes.STRING
  },
  
  about: {
    type: DataTypes.STRING
  },
  
  email: {
    type: DataTypes.STRING
  }
  
}, {
  hooks: {
    async beforeSave(instance) {
      if (instance.changed('password')) {
        const saltRounds = parseInt(process.env.SALT_ROUNDS) || 6;
        instance.password = await bcrypt.hash(instance.password, saltRounds)
      }
    }
  }
});
