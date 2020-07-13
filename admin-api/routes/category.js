const express = require('express');
const userRole = require('../middlewares/user-role');

module.exports = ({ Category }, sequelize) => {
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
   * /POST /categories
   */
  
  router.post('/', userRole, async (req, res, next) => {
    try {
      if (!req.body.title || (typeof req.body.title !== 'string')) {
        return res.status(400).send({
          status: 'error',
          message: 'Title not found'
        });
      }
      
      const isExist = await Category.findOne({ where: { title: req.body.title } });
      if (isExist) {
        return res.status(400).send({
          status: 'error',
          message: 'Category already exists'
        });
      }
      
      const category = Category.build({ title: req.body.title });
      
      await sequelize.transaction(async () => {
        await category.save();
      });
      
      res.status(201).send({ status: 'ok', data: category });
      
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
   * /PUT /categories/:id
   */
  
  router.put('/:id', userRole, getCategoryById, async (req, res, next) => {
    try {
      if (typeof req.body.title === 'string') { 
        const isExist = await Category.findOne({ where: { title: req.body.title } });
        if (isExist) {
          return res.status(400).send({
            status: 'error',
            message: 'Category already exists'
          });
        }
        req.category.title = req.body.title; 
      }
      
      await sequelize.transaction(async () => {
        await req.category.save();
      });
      
      res.send({ status: 'ok', data: req.category });
      
    } catch(err) {
      next(err);
    }
  });
  
  /**
   * /DELETE /categories/:id
   */
  
  router.delete('/:id', userRole, getCategoryById, async (req, res, next) => {
    try {
      await sequelize.transaction(async () => {
        await req.category.destroy();
      });
    
      res.send({ status: 'ok' });
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
