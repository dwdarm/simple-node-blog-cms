const { 
  sendNotFoundError, 
  sendBadRequestError,
  sendForbiddenError 
} = require('../utils/error-response');

const ArticleController = ({ db }) => ({
  
  async getAll(req, res, next) {
    const { Article } = db;
    
    try {
      const { count, rows } = await Article.getAll({
        ...req.query,
        status: req.loggedUser ? req.query.status : 'published'
      });
      
      res.send({ 
        status: 'ok', 
        total: count, 
        data: rows.map(e => e.toJSON(req.loggedUser)) 
      });
    } catch(err) {
      next(err);
    } 
  },
  
  async getById(req, res, next) {
    if (!parseInt(req.params.id)) {
      return sendNotFoundError(res);
    }
    
    const { Article } = db;
    
    try {
      const article = await Article.getById(req.params.id);
      if (!article) {
        return sendNotFoundError(res);
      }
      
      res.send({ 
        status: 'ok', 
        data: article.toJSON(req.loggedUser)  
      });
    } catch(err) {
      next(err);
    } 
  },
  
  async getBySlug(req, res, next) {
    const { Article } = db;
    try {
      const article = await Article.getBySlug(req.params.slug);
      if (!article) {
        return sendNotFoundError(res);
      }
      
      res.send({ 
        status: 'ok', 
        data: article.toJSON(req.loggedUser)  
      });
    
    } catch(err) {
      next(err);
    } 
  },
  
  async create(req, res, next) {
    if (!req.body.title || typeof req.body.title !== 'string') {
      return sendBadRequestError('Title not found')(res);
    }
    
    if (req.body.title.length === 0) {
      return sendBadRequestError('Empty title')(res);
    }
    
    const { Article, sequelize } = db;
    
    try {
      await sequelize.transaction(async () => {
        let article = await Article.createNew(req.body);
        await req.loggedUser.addArticle(article);
        
        article = await Article.getById(article.id);
        
        res.status(201).send({ 
          status: 'ok', 
          data: article.toJSON(req.loggedUser) 
        });
        
      });
    } catch(err) {
      next(err);
    } 
  },
  
  async update(req, res, next) {
    if (!parseInt(req.params.id)) {
      return sendNotFoundError(res);
    }
    
    const { Article, sequelize } = db;
    
    try {
      const article = await Article.getById(req.params.id);
      if (!article) {
        return sendNotFoundError(res);
      }
      
      if (req.loggedUser.id !== article.User.id) {
        return sendForbiddenError(res);
      }
      
      await sequelize.transaction(async () => {
        await article.change(req.body);
      });
      
      res.status(200).send({ 
        status: 'ok', 
        data: article.toJSON(req.loggedUser) 
      });
      
    } catch(err) {
      next(err);
    } 
  },
  
  async delete(req, res, next) {
    if (!parseInt(req.params.id)) {
      return sendNotFoundError(res);
    }
    
    const { Article, sequelize } = db;
    
    try {
      const article = await Article.getById(req.params.id);
      if (!article) {
        return sendNotFoundError(res);
      }
      
      if (req.loggedUser.id !== article.User.id) {
        return sendForbiddenError(res);
      }
      
      await sequelize.transaction(async () => {
        await article.destroy();
      });
      
      res.send({ status: 'ok' });
    } catch(err) {
      next(err);
    } 
  },
  
});

module.exports = ArticleController;
