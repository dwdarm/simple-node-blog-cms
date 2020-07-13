const express = require('express');

module.exports = ({ Tag, sequelize}) => {
  const router = express.Router();
  
  const getTagById = async (req, res, next) => {
    
    if (!parseInt(req.params.id)) {
      return res.status(404).send({
        status: 'error',
        message: 'Tag not found'
      });
    }
    
    try {
      const tag = await Tag.findByPk(req.params.id);
      if (!tag) {
        return res.status(404).send({
          status: 'error',
          message: 'Tag not found'
        });
      }
      
      req.tag = tag;
      next();
    } catch(err) {
      next(err);
    }
  }
  
  /**
   * /GET /tags
   */
  
  router.get('/', async (req, res, next) => {
    try {
      const tags = await Tag.findAll();
      res.send({ status: 'ok', data: tags });
    } catch(err) {
      next(err);
    }
  });
  
  /**
   * /POST /tags
   */
  
  router.post('/', async (req, res, next) => {
    try {
      if (!req.body.title || (typeof req.body.title !== 'string')) {
        return res.status(400).send({
          status: 'error',
          message: 'Title not found'
        });
      }
      
      const isExist = await Tag.findOne({ where: { title: req.body.title } });
      if (isExist) {
        return res.status(400).send({
          status: 'error',
          message: 'Tag already exists'
        });
      }
      
      const tag = Tag.build({ title: req.body.title });
      
      await sequelize.transaction(async () => {
        await tag.save();
      });
      
      res.status(201).send({ status: 'ok', data: tag });
      
    } catch(err) {
      next(err);
    }
  });
  
  /**
   * /GET /tags/:id
   */
  
  router.get('/:id', getTagById, async (req, res, next) => {
    try {
      res.send({ status: 'ok', data: req.tag });
    } catch(err) {
      next(err);
    }
  });
  
  /**
   * /PUT /tags/:id
   */
  
  router.put('/:id', getTagById, async (req, res, next) => {
    try {
      if (typeof req.body.title === 'string') { 
        const isExist = await Tag.findOne({ where: { title: req.body.title } });
        if (isExist) {
          return res.status(400).send({
            status: 'error',
            message: 'Tag already exists'
          });
        }
        req.tag.title = req.body.title; 
      }
      
      await sequelize.transaction(async () => {
        await req.tag.save();
      });
      
      res.send({ status: 'ok', data: req.tag });
      
    } catch(err) {
      next(err);
    }
  });
  
  /**
   * /DELETE /tags/:id
   */
  
  router.delete('/:id', getTagById, async (req, res, next) => {
    try {
      await sequelize.transaction(async () => {
        await req.tag.destroy();
      });
      
      res.send({ status: 'ok' });
    } catch(err) {
      next(err);
    }
  });
  
  /**
   * /GET /tags/slug/:slug
   */
  
  router.get('/slug/:slug', async (req, res, next) => {
    try {
      const tag = await Tag.findOne({ 
        where: { slug: req.params.slug || '' }
      });
      if (!tag) {
        return res.status(404).send({
          status: 'error',
          message: 'Tag not found'
        });
      }
      
      res.send({ status: 'ok', data: tag });
    } catch(err) {
      next(err);
    }
  });
  
  return router;
}
