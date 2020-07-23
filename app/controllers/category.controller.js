const { 
  sendNotFoundError, 
  sendBadRequestError,
  sendForbiddenError 
} = require('../utils/error-response');

const CategoryController = ({ db }) => ({
  async getAll(req, res, next) {
    const { Category } = db;
    
    try {
      const categories = await Category.findAll();
      res.send({ status: 'ok', data: categories });
    } catch(err) {
      next(err);
    }
  },
  
  async getById(req, res, next) {
    if (!parseInt(req.params.id)) {
      return sendNotFoundError(res);
    }
    
    const { Category } = db;
    
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return sendNotFoundError(res);
      }
      
      res.send({ status: 'ok', data: category });
    } catch(err) {
      next(err);
    }
  },
  
  async getBySlug(req, res, next) {
    const { Category } = db;
    
    try {
      const category = await Category.findOne({ 
        where: { slug: req.params.slug || '' }
      });
      
      if (!category) {
        return sendNotFoundError(res);
      }
      
      res.send({ status: 'ok', data: category });
    } catch(err) {
      next(err);
    }
  },
  
  async create(req, res, next) {
    if (!req.body.title || typeof req.body.title !== 'string') {
      return sendBadRequestError('Title not found')(res);
    }
    
    const { Category, sequelize } = db;
    
    try {
      const isExist = await Category.findOne({ where: { title: req.body.title } });
      if (isExist) {
        return sendBadRequestError('Category already exists')(res);
      }
      
      const category = Category.build({ title: req.body.title });
      
      await sequelize.transaction(async () => {
        await category.save();
      });
      
      res.status(201).send({ status: 'ok', data: category });
      
    } catch(err) {
      next(err);
    } 
  },
  
  async update(req, res, next) {
    if (!parseInt(req.params.id)) {
      return sendNotFoundError(res);
    }
    
    const { Category, sequelize } = db;
    
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return sendNotFoundError(res);
      }
      
      if (typeof req.body.title === 'string') { 
        const isExist = await Category.findOne({ where: { title: req.body.title } });
        if (isExist) {
          return sendBadRequestError('Category already exists')(res);
        }
        category.title = req.body.title; 
      }
      
      await sequelize.transaction(async () => {
        await category.save();
      });
      
      res.send({ status: 'ok', data: category });
      
    } catch(err) {
      next(err);
    }
  },
  
  async delete(req, res, next) {
    if (!parseInt(req.params.id)) {
      return sendNotFoundError(res);
    }
    
    const { Category, sequelize } = db;
    
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return sendNotFoundError(res);
      }
      
      await sequelize.transaction(async () => {
        await category.destroy();
      });
    
      res.send({ status: 'ok' });
    } catch(err) {
      next(err);
    }
  },
  
});

module.exports = CategoryController;
