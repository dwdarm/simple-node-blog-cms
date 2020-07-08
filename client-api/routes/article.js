const express = require('express');
const { Op } = require("sequelize");
const DEFAULT_LIMIT = 20;

module.exports = ({ Article, User, Category, Tag }) => {
  const router = express.Router();
  
  const getArticleById = async (req, res, next) => {
    try {
      const article = await Article.findByPk(req.params.id, {
        attributes: { exclude: ['UserId'] },
        include: [
          { 
            model: User,
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
          },
          { 
            model: Category 
          },
          { 
            model: Tag 
          }
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
  
  /**
   * /GET /articles
   */
   
  router.get('/', async (req, res, next) => {
    try {
      const query = {
        attributes: { exclude: ['UserId'] }
      }
      
      query.limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
      query.offset = ((parseInt(req.query.page) || 1) - 1) * query.limit;
      
      query.where = { isPublished: true }
      if (typeof req.query.userId === 'string') { query.where.userId = req.query.userId; }
      if (req.query.isPage) { where.isPage = true; }
      if (req.query.isFeatured) { where.isFeatured = true; }
      
      query.order = []
      if (req.query.sort === 'title_asc') { query.order.push(['title', 'ASC']); } 
      else if (req.query.sort === 'title_desc') { query.order.push(['title', 'DESC']); } 
      else if (req.query.sort === 'created_asc') { query.order.push(['createdAt', 'ASC']); } 
      else if (req.query.sort === 'created_desc') { query.order.push(['createdAt', 'DESC']); } 
      else if (req.query.sort === 'updated_asc') { query.order.push(['updatedAt', 'ASC']); } 
      else if (req.query.sort === 'updated_desc') { query.order.push(['updatedAt', 'DESC']); } 
      else if (req.query.sort === 'published_asc') { query.order.push(['publishedAt', 'ASC']); } 
      else if (req.query.sort === 'published_desc') { query.order.push(['publishedAt', 'DESC']); } 
      
      query.include = [
        { 
          model: User,
          attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
        },
        { 
          model: Category,
          where: typeof req.query.categoryId === 'string' ? { id: req.query.categoryId } : undefined
        },
        { 
          model: Tag, 
          where: typeof req.query.tagId === 'string' ? { id: req.query.tagId } : undefined
        }
      ]
      
      const { count, rows } = await Article.findAndCountAll(query);
      
      res.send({ status: 'ok', total: count, data: rows });
      
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
   * /GET /articles/slug/:slug
   */
  
  router.get('/slug/:slug', async (req, res, next) => {
    try {
      const article = await Article.findOne({ 
        where: { slug: req.params.slug || '' },
        include: [
          { 
            model: User,
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
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
