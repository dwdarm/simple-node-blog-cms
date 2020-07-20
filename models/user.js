'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(models.Article);
      models.User.hasOne(models.PasswordToken);
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING(32),
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
    fullName: DataTypes.STRING,
    urlToAvatar: DataTypes.STRING,
    about: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    hooks: {
      async beforeSave(instance) {
        if (instance.changed('password')) {
          const saltRounds = parseInt(process.env.SALT_ROUNDS) || 6;
          instance.password = await bcrypt.hash(instance.password, saltRounds)
        }
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};
