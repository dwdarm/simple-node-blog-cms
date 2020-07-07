const { Sequelize, DataTypes } = require('sequelize');
const slugify = require('slugify');

module.exports = sequelize => sequelize.define('Category', {
  
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  
  slug: {
    type: DataTypes.STRING
  }
  
}, {
  hooks: {
    beforeSave(instance) {
      if (instance.changed('title')) {
        instance.slug = slugify(instance.title.toLowerCase());
      }
    }
  }
});
