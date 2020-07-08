const { Sequelize, DataTypes } = require('sequelize');
const slugify = require('slugify');
const cryptoRandomString = require('crypto-random-string');

module.exports = sequelize => sequelize.define('Article', {
  
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  slug: {
    type: DataTypes.STRING
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
  
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  publishedAt: {
    type: DataTypes.DATE,
  }
  
},  {
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
  }
});
