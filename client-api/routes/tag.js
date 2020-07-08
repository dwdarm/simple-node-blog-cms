const express = require('express');

module.exports = ({ Tag }) => {
  const router = express.Router();
  
  const getTagById = async (req, res, next) => {
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
