const express = require('express');

module.exports = ({ Category }) => {
  const router = express.Router();
  
  const getCategoryById = async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).send({
          status: 'error',
          message: 'Category not found'
        });
      }
      
      req.category = category;
      next();
    } catch(err) {
      next(err);
    }
  }
  
  /**
   * /GET /categories
   */
  
  router.get('/', async (req, res, next) => {
    try {
      const categories = await Category.findAll();
      res.send({ status: 'ok', data: categories });
    } catch(err) {
      next(err);
    }
  });
  
  /**
   * /GET /categories/:id
   */
  
  router.get('/:id', getCategoryById, async (req, res, next) => {
    try {
      res.send({ status: 'ok', data: req.category });
    } catch(err) {
      next(err);
    }
  });
  
  /**
   * /GET /categories/slug/:slug
   */
  
  router.get('/slug/:slug', async (req, res, next) => {
    try {
      const category = await Category.findOne({ 
        where: { slug: req.params.slug || '' }
      });
      if (!category) {
        return res.status(404).send({
          status: 'error',
          message: 'Category not found'
        });
      }
      
      res.send({ status: 'ok', data: category });
    } catch(err) {
      next(err);
    }
  });
  
  return router;
}
