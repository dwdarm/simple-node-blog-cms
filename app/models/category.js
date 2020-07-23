'use strict';
const { Model } = require('sequelize');
const slugify = require('slugify');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Category.belongsToMany(models.Article, { through: 'PostCategories' });
    }
  };
  Category.init({
    title: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true
    },
    slug: DataTypes.STRING
  }, {
    hooks: {
      beforeSave(instance) {
        if (instance.changed('title')) {
          instance.slug = slugify(instance.title.toLowerCase());
        }
      }
    },
    sequelize,
    modelName: 'Category',
  });
  return Category;
};
