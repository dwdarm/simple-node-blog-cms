'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const validator = require('validator');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    /**
     * Get a user by ID
     */
    static async getById(id) {
      const user = await this.findByPk(id);
      
      return user;
    }
    
    /**
     * Get a user by username
     */
    static async getByUsername(username = '') {
      const article = await this.findOne({ where: { username } });
      
      return article;
    }
    
    /**
     * Update a user
     */
    async change(data = {}) {
      const { 
        username, 
        password, 
        fullName, 
        urlToAvatar, 
        about, 
        email 
      } = data;
  
      if (typeof username === 'string') {
        const trimmedUsername = username.trim();
        if (trimmedUsername.length >= 4) {
          this.username = trimmedUsername;
        }
      }
      
      if (typeof email === 'string') { 
        const trimmedEmail = email.trim();
        if (validator.isEmail(trimmedEmail) && trimmedEmail !== this.email) {
          const isEmailExist = await sequelize.models.User.findOne({
            where: { email: trimmedEmail }
          });
          if (!isEmailExist) {
            this.email = trimmedEmail;
          }
        }
      }
      
      if (typeof password === 'string') { this.password = password.trim(); }
      if (typeof fullName === 'string') { this.fullName = fullName.trim(); }
      if (typeof urlToAvatar === 'string') { this.urlToAvatar = urlToAvatar.trim(); }
      if (typeof about === 'string') { this.about = about; }
      
      await this.save();
      
      return this;
    }
    
    async isPasswordValid(password = '') {
      return await bcrypt.compare(password, this.password);
    }
    
    toJSON(user = {}) {
      return {
        id: this.id,
        username: this.username,
        role: this.role,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        fullName: this.fullName,
        urlToAvatar: this.urlToAvatar,
        about: this.about,
        email: this.email,
        isOwner: this.id === user.id
      }
    }
    
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
