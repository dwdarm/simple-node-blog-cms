const { 
  sendNotFoundError, 
  sendBadRequestError,
  sendForbiddenError 
} = require('../utils/error-response');

const TagController = ({ db }) => ({

  async getAll(req, res, next) {
    const { Tag } = db;
    
    try {
      const tags = await Tag.findAll();
      res.send({ status: 'ok', data: tags });
    } catch(err) {
      next(err);
    }
  },
  
  async getById(req, res, next) {
    if (!parseInt(req.params.id)) {
      return sendNotFoundError(res);
    }
    
    const { Tag } = db;
    
    try {
      const tag = await Tag.findByPk(req.params.id);
      if (!tag) {
        return sendNotFoundError(res);
      }
      res.send({ status: 'ok', data: tag });
    } catch(err) {
      next(err);
    }
  },
  
  async getBySlug(req, res, next) {
    const { Tag } = db;
    try {
      const tag = await Tag.findOne({ 
        where: { slug: req.params.slug || '' }
      });
      
      if (!tag) {
        return sendNotFoundError(res);
      }
      
      res.send({ status: 'ok', data: tag });
    } catch(err) {
      next(err);
    }
  },
  
  async create(req, res, next) {
    if (!req.body.title || typeof req.body.title !== 'string') {
      return sendBadRequestError('Title not found')(res);
    }
    
    const { Tag, sequelize } = db;
    
    try {
      const isExist = await Tag.findOne({ where: { title: req.body.title } });
      if (isExist) {
        return sendBadRequestError('Tag already exists')(res);
      }
      
      const tag = Tag.build({ title: req.body.title });
      
      await sequelize.transaction(async () => {
        await tag.save();
      });
      
      res.status(201).send({ status: 'ok', data: tag });
      
    } catch(err) {
      next(err);
    } 
  },
  
  async update(req, res, next) {
    if (!parseInt(req.params.id)) {
      return sendNotFoundError(res);
    }
    
    const { Tag, sequelize } = db;
    
    try {
      const tag = await Tag.findByPk(req.params.id);
      if (!tag) {
        return sendNotFoundError(res);
      }
      
      if (typeof req.body.title === 'string') { 
        const isExist = await Tag.findOne({ where: { title: req.body.title } });
        if (isExist) {
          return sendBadRequestError('Category already exists')(res);
        }
        tag.title = req.body.title; 
      }
      
      await sequelize.transaction(async () => {
        await tag.save();
      });
      
      res.send({ status: 'ok', data: tag });
      
    } catch(err) {
      next(err);
    }
  },
  
  async delete(req, res, next) {
    if (!parseInt(req.params.id)) {
      return sendNotFoundError(res);
    }
    
    const { Tag, sequelize } = db;
    
    try {
      const tag = await Tag.findByPk(req.params.id);
      if (!tag) {
        return sendNotFoundError(res);
      }
      
      await sequelize.transaction(async () => {
        await tag.destroy();
      });
    
      res.send({ status: 'ok' });
    } catch(err) {
      next(err);
    }
  },
  
});

module.exports = TagController;
