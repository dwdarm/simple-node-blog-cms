'use strict';
const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PasswordToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.PasswordToken.belongsTo(models.User);
    }
  };
  PasswordToken.init({
    token: { 
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    hooks: {
      async beforeSave(instance) {
        if (instance.changed('token')) {
          const saltRounds = parseInt(process.env.SALT_ROUNDS) || 6;
          instance.token = await bcrypt.hash(instance.token, saltRounds)
        }
      }
    },
    sequelize,
    modelName: 'PasswordToken',
  });
  return PasswordToken;
};
