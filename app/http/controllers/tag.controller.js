const errorResponse = require('../../utils/error-response');

const TagController = ({ Tag, sequelize }) => ({

  async getAll(req, res, next) {
    try {
      const tags = await Tag.findAll();
      res.send({ status: 'ok', data: tags });
    } catch(err) {
      next(err);
    }
  },
  
  getById(req, res, next) {
    try {
      res.send({ status: 'ok', data: req.tag });
    } catch(err) {
      next(err);
    }
  },
  
  async getBySlug(req, res, next) {
    try {
      const tag = await Tag.findOne({ 
        where: { slug: req.params.slug || '' }
      });
      
      if (!tag) {
        return errorResponse.sendNotFoundError(res);
      }
      
      res.send({ status: 'ok', data: tag });
    } catch(err) {
      next(err);
    }
  },
  
  async create(req, res, next) {
    if (!req.body.title || 
        typeof req.body.title !== 'string' || 
        req.body.title.length === 0) {
          
      return errorResponse.sendBadRequestError('Title not found')(res);
      
    }
    
    try {
      const isExist = await Tag.findOne({ where: { title: req.body.title } });
      if (isExist) {
        return errorResponse.sendBadRequestError('Tag already exists')(res);
      }
      
      let tag;
      await sequelize.transaction(async () => {
        tag = await Tag.create({ title: req.body.title });
      });
      
      res.status(201).send({ status: 'ok', data: tag });
      
    } catch(err) {
      next(err);
    } 
  },
  
  async update(req, res, next) {
    try {
      if (typeof req.body.title === 'string') { 
        const isExist = await Tag.findOne({ where: { title: req.body.title } });
        if (isExist) {
          return errorResponse.sendBadRequestError('Tag already exists')(res);
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
  },
  
  async delete(req, res, next) {
    try {
      await sequelize.transaction(async () => {
        await req.tag.destroy();
      });
    
      res.send({ status: 'ok' });
    } catch(err) {
      next(err);
    }
  },
  
});

module.exports = TagController;
