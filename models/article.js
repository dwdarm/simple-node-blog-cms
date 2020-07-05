const { Sequelize, DataTypes } = require('sequelize');

module.exports = sequelize => sequelize.define('Article', {
  
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  
  content: {
    type: DataTypes.TEXT
  },
  
  urlToHeader: {
    type: DataTypes.STRING
  },
  
  isPage: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
});
