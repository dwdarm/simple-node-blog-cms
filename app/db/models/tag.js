'use strict';
const { Model } = require('sequelize');
const slugify = require('slugify');

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    
    /**
     * Get a Tag by ID
     */
    static async getById(id) {
      return await this.findByPk(id);
    }
    
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Tag.belongsToMany(models.Article, { through: 'PostTags' });
    }
  };
  Tag.init({
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
    modelName: 'Tag',
  });
  return Tag;
};
