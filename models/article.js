'use strict';

const { Model } = require('sequelize');
const slugify = require('slugify');
const cryptoRandomString = require('crypto-random-string');

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Article.belongsTo(models.User);
      models.Article.belongsToMany(models.Category, { through: 'PostCategories' });
      models.Article.belongsToMany(models.Tag, { through: 'PostTags' });
    }
  };
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: DataTypes.STRING,
    urlToHeader: DataTypes.STRING,
    content: DataTypes.TEXT,
    isPage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    publishedAt: DataTypes.DATE
  }, {
    hooks: {
      async beforeSave(instance) {
      
        if (instance.changed('title')) {
          const baseSlug = slugify(instance.title);
          let slug = baseSlug + '-' + cryptoRandomString({length:4})
          let isSlugExist = await this.findOne({where:{slug}});
          while(isSlugExist) {
            slug = baseSlug + '-' + cryptoRandomString({length:4});
            isSlugExist = await this.findOne({where:{slug}});
          }
          instance.slug = slug;
        }
      
        if (instance.changed('isPublished')) {
          if (instance.isPublished && !instance.publishedAt) {
            instance.publishedAt = Date.now();
          }
        }
      
      }
    },
    sequelize,
    modelName: 'Article',
  });
  return Article;
};
