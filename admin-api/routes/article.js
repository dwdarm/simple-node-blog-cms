const express = require('express');
const { Op } = require("sequelize");

module.exports = ({ Article, User, Category, Tag }) => {
  const router = express.Router();
  
  const getArticleById = async (req, res, next) => {
    try {
      const article = await Article.findByPk(req.params.id, {
        include: [
          { 
            model: User,
            attributes: { exclude: ['password'] }
          },
          { model: Category },
          { model: Tag }
        ]
      });
      if (!article) {
        return res.status(404).send({
          status: 'error',
          message: 'Article not found'
        });
      }
      
      req.article = article;
      next();
    } catch(err) {
      next(err);
    }
  }
  
  const isOwner = (req, res, next) => {
    if (req.loggedUser.id !== req.article.User.id) {
      return res.status(403).send({
        status: 'error',
        message: 'Forbidden access'
      });
    }
    
    next();
  }
  
  /**
   * /GET /articles
   */
   
  router.get('/', async (req, res, next) => {
    try {
      const articles = await Article.findAll({
        include: [
          { 
            model: User,
            attributes: { exclude: ['password'] }
          },
          { model: Category },
          { model: Tag }
        ]
      });
      res.send({ status: 'ok', data: articles });
    } catch(err) {
      next(err);
    } 
  });
  
  /**
   * /POST /articles
   */
  
  router.post('/', async (req, res, next) => {
    try {
      const { title, content, urlToHeader, isPage, isPublished, tags, categories } = req.body;

      const data = {}
      if (typeof title === 'string') { data.title = title; }
      if (typeof content === 'string') { data.content = content; }
      if (typeof urlToHeader === 'string') { data.urlToHeader = urlToHeader; }
      if (typeof isPage === 'boolean') { data.isPage = isPage; }
      if (typeof isPublished === 'boolean') { data.isPublished = isPublished; }
      
      if (!data.title) {
        return res.status(400).send({
          status: 'error',
          message: 'Title not found'
        });
      }
      
      const article = await Article.create(data);
      await req.loggedUser.addArticle(article);
      
      if (Array.isArray(categories)) {
        const catArr = categories.filter(e => typeof e === 'number');
        if (catArr.length > 0) {
          const catObjs = await Category.findAll({
            where: { id: { [Op.or]: catArr } }
          });
          if (catObjs.length > 0) {
            await article.setCategories(catObjs); 
          }
        }
      }
      
      if (Array.isArray(tags)) {
        const tagArr = tags.filter(e => typeof e === 'number');
        if (tagArr.length > 0) {
          const tagObjs = await Tag.findAll({
            where: { id: { [Op.or]: tagArr } }
          });
          if (tagObjs.length > 0) {
            await article.setTags(tagObjs); 
          }
        }
      }
      
      res.status(201).send({ status: 'ok', data: article });
    } catch(err) {
      next(err);
    } 
  });
  
  /**
   * /GET /articles/:id
   */
  
  router.get('/:id', getArticleById, async (req, res, next) => {
    try {
      res.send({ status: 'ok', data: req.article });
    } catch(err) {
      next(err);
    } 
  });
  
  /**
   * /PUT /articles/:id
   */
  
  router.put('/:id', getArticleById, isOwner, async (req, res, next) => {
    try {
      const { article } = req;
      const { title, content, urlToHeader, isPage, isPublished, tags, categories } = req.body;
      
      if (typeof title === 'string') { article.title = title; }
      if (typeof content === 'string') { article.content = content; }
      if (typeof urlToHeader === 'string') { article.urlToHeader = urlToHeader; }
      if (typeof isPage === 'boolean') { article.isPage = isPage; }
      if (typeof isPublished === 'boolean') { article.isPublished = isPublished; }
      await article.save();
      
      if (Array.isArray(categories)) {
        const catArr = categories.filter(e => typeof e === 'number');
        if (catArr.length > 0) {
          const catObjs = await Category.findAll({
            where: { id: { [Op.or]: catArr } }
          });
          if (catObjs.length > 0) {
            await article.setCategories(catObjs); 
          }
        } else {
          await article.setCategories([]);
        }
      }
      
      if (Array.isArray(tags)) {
        const tagArr = tags.filter(e => typeof e === 'number');
        if (tagArr.length > 0) {
          const tagObjs = await Tag.findAll({
            where: { id: { [Op.or]: tagArr } }
          });
          if (tagObjs.length > 0) {
            await article.setTags(tagObjs); 
          }
        } else {
          await article.setTags([]);
        }
      }
      
      res.send({ status: 'ok', data: article });
      
    } catch(err) {
      next(err);
    } 
  });
  
  /**
   * /DELETE /articles/:id
   */
  
  router.delete('/:id', getArticleById, isOwner, async (req, res, next) => {
    try {
      await req.article.destroy();
      res.send({ status: 'ok' });
    } catch(err) {
      next(err);
    } 
  });
  
  /**
   * /GET /articles/slug/:slug
   */
  
  router.get('/slug/:slug', async (req, res, next) => {
    try {
      const article = await Article.findOne({ 
        where: { slug: req.params.slug || '' },
        include: [
          { 
            model: User,
            attributes: { exclude: ['password'] }
          },
          { model: Category },
          { model: Tag }
        ]
      });
      if (!article) {
        return res.status(404).send({
          status: 'error',
          message: 'Article not found'
        });
      }
      
      res.send({ status: 'ok', data: article });
    
    } catch(err) {
      next(err);
    } 
  });
  
  return router;
}
