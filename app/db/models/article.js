'use strict';

const { Model, Op } = require('sequelize');
const slugify = require('slugify');
const cryptoRandomString = require('crypto-random-string');
const DEFAULT_LIMIT = 20;

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    
    /**
     * Get all articles
     */
    static async getAll(options = {}) {
      const query = {
        where: {},
        order: []
      }
      
      query.limit = parseInt(options.limit) || DEFAULT_LIMIT,
      query.offset = ((parseInt(options.page) || 1) - 1) * query.limit
      
      if (typeof options.userId === 'string') { 
        query.where.userId = options.userId; 
      }
      
      if (options.isPage) { where.isPage = true; }
      if (options.isFeatured) { where.isFeatured = true; }
      
      if (typeof options.status === 'string') {
        if (options.status === 'published') { 
          query.where.isPublished = true 
        }
        else if (options.status === 'draft') { 
          query.where.isPublished = false 
        }
      }
      
      switch(options.sort) {
        case 'title_asc':
          query.order.push(['title', 'ASC']);
          break;
        case 'title_desc':
          query.order.push(['title', 'DESC']);
          break;
        case 'created_asc':
          query.order.push(['createdAt', 'ASC']);
          break;
        case 'created_desc':
          query.order.push(['createdAt', 'DESC']);
          break;
        case 'published_asc':
          query.order.push(['publishedAt', 'ASC']);
          break;
        case 'published_asc':
          query.order.push(['publishedAt', 'DESC']);
          break;
        case 'updated_asc':
          query.order.push(['updatedAt', 'ASC']);
          break;
        default:
          query.order.push(['updatedAt', 'DESC']);
          break;
      }
      
      query.include = [
        { model: sequelize.models.User },
        { 
          model: sequelize.models.Category,
          where: typeof options.categoryId === 'string' 
            ? { id: options.categoryId } 
            : undefined
        },
        { 
          model: sequelize.models.Tag, 
          where: typeof options.tagId === 'string' 
            ? { id: options.tagId } 
            : undefined
        }
      ]
      
      return await this.findAndCountAll(query);
    }
    
    /**
     * Get an article by ID
     */
    static async getById(id) {
      const article = await this.findByPk(id, {
        attributes: { exclude: ['UserId'] },
        include: [
          { model: sequelize.models.User },
          { model: sequelize.models.Category },
          { model: sequelize.models.Tag }
        ]
      });
      
      return article;
    }
    
    /**
     * Get an article by Slug
     */
    static async getBySlug(slug = '') {
      const article = this.findOne({ 
        where: { slug },
        include: [
          { model: sequelize.models.User },
          { model: sequelize.models.Category },
          { model: sequelize.models.Tag }
        ]
      });
      
      return article;
    }
    
    /**
     * Create a article 
     */
    static async createNew(data = {}) {
      const { 
        title, 
        content, 
        urlToHeader, 
        isPage, 
        isPublished, 
        tags, 
        categories 
      } = data;
      
      const parameters = {}
      
      if (typeof title === 'string') { 
        parameters.title = title.trim(); 
      }
      
      if (typeof content === 'string') { 
        parameters.content = content; 
      }
      
      if (typeof urlToHeader === 'string') { 
        parameters.urlToHeader = urlToHeader.trim(); 
      }
      
      if (typeof isPage === 'boolean') { 
        parameters.isPage = isPage; 
      }
      
      if (typeof isPublished === 'boolean') { 
        parameters.isPublished = isPublished; 
      }
      
      const article = await this.create(parameters);
      await article.setCategoriesIfExist(categories);
      await article.setTagsIfExist(tags);
      
      return article;
    }
    
    /**
     * Update a article 
     */
    async change(data = {}) {
      const { 
        title, 
        content, 
        urlToHeader, 
        isPage, 
        isPublished, 
        tags, 
        categories 
      } = data;
      
      if (typeof title === 'string' && title.length > 0) { 
        this.title = title; 
      }
      
      if (typeof content === 'string') { 
        this.content = content; 
      }
      
      if (typeof urlToHeader === 'string') { 
        this.urlToHeader = urlToHeader; 
      }
      
      if (typeof isPage === 'boolean') { 
        this.isPage = isPage; 
      }
      
      if (typeof isPublished === 'boolean') { 
        this.isPublished = isPublished; 
      }
      
      await this.save();
      await this.setCategoriesIfExist(categories);
      await this.setTagsIfExist(tags);
      
      return this;
    }
    
    async setCategoriesIfExist(categories) {
      if (Array.isArray(categories)) {
        const catArr = categories.filter(e => typeof e === 'number');
        if (catArr.length > 0) {
          const catObjs = await sequelize.models.Category.findAll({
            where: { id: { [Op.or]: catArr } }
          });
          if (catObjs.length > 0) {
            await this.setCategories(catObjs); 
          }
        } else {
          await this.setCategories([]); 
        }
      }
    }
    
    async setTagsIfExist(tags) {
      if (Array.isArray(tags)) {
        const tagArr = tags.filter(e => typeof e === 'number');
        if (tagArr.length > 0) {
          const tagObjs = await sequelize.models.Tag.findAll({
            where: { id: { [Op.or]: tagArr } }
          });
          if (tagObjs.length > 0) {
            await this.setTags(tagObjs); 
          }
        } else {
          await this.setTags([]); 
        }
      }
    }
    
    toJSON(user = {}) {
      return {
        id: this.id,
        title: this.title,
        slug: this.slug,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        publishedAt: this.publishedAt,
        urlToHeader: this.urlToHeader,
        content: this.content,
        isPage: this.isPage,
        isPublished: this.isPublished,
        isFeatured: this.isFeatured,
        User: this.User.toJSON(user),
        Categories: this.Categories.map(e => e.toJSON()),
        Tags: this.Tags.map(e => e.toJSON()),
        isOwner: this.User.id === user.id
      }
    }
    
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
          const baseSlug = slugify(instance.title.toLowerCase());
          let slug = baseSlug;
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
