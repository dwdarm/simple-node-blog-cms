const errorResponse = require('../../utils/error-response');

const CategoryController = ({ Category, sequelize }) => ({
  
  async getAll(req, res, next) {
    try {
      const categories = await Category.findAll();
      res.send({ status: 'ok', data: categories });
    } catch(err) {
      next(err);
    }
  },
  
  getById(req, res, next) {
    try {
      res.send({ status: 'ok', data: req.category });
    } catch(err) {
      next(err);
    }
  },
  
  async getBySlug(req, res, next) {
    try {
      const category = await Category.findOne({ 
        where: { slug: req.params.slug || '' }
      });
      
      if (!category) {
        return errorResponse.sendNotFoundError(res);
      }
      
      res.send({ status: 'ok', data: category });
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
      const isExist = await Category.findOne({ where: { title: req.body.title } });
      if (isExist) {
        return errorResponse.sendBadRequestError('Category already exists')(res);
      }
      
      let category;
      await sequelize.transaction(async () => {
        category = await Category.create({ title: req.body.title });
      });
      
      res.status(201).send({ status: 'ok', data: category });
      
    } catch(err) {
      next(err);
    } 
  },
  
  async update(req, res, next) {
    try {
      if (typeof req.body.title === 'string') { 
        const isExist = await Category.findOne({ where: { title: req.body.title } });
        if (isExist) {
          return errorResponse.sendBadRequestError('Category already exists')(res);
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
  },
  
  async delete(req, res, next) {
    try {
      await sequelize.transaction(async () => {
        await req.category.destroy();
      });
    
      res.send({ status: 'ok' });
    } catch(err) {
      next(err);
    }
  },
  
});

module.exports = CategoryController;
