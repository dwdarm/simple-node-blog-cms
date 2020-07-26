const errorResponse = require('../../utils/error-response');

const ArticleController = ({ Article, sequelize }) => ({
  
  async getAll(req, res, next) {
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
  
  getById(req, res, next) {
    try {
      res.send({ 
        status: 'ok', 
        data: req.article.toJSON(req.loggedUser)  
      });
    } catch(err) {
      next(err);
    } 
  },
  
  async getBySlug(req, res, next) {
    try {
      const article = await Article.getBySlug(req.params.slug);
      if (!article) {
        return errorResponse.sendNotFoundError(res);
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
      return errorResponse.sendBadRequestError('Title not found')(res);
    }
    
    try {
      let article;
      await sequelize.transaction(async () => {
        article = await Article.createNew(req.body);
        await req.loggedUser.addArticle(article);
        
        article = await Article.getById(article.id);
      });
      
      res.status(201).send({ 
        status: 'ok', 
        data: article.toJSON(req.loggedUser) 
      });
    } catch(err) {
      next(err);
    } 
  },
  
  async update(req, res, next) {
    try {
      await sequelize.transaction(async () => {
        await req.article.change(req.body);
      });
      
      res.send({ 
        status: 'ok', 
        data: req.article.toJSON(req.loggedUser) 
      });
      
    } catch(err) {
      next(err);
    } 
  },
  
  async delete(req, res, next) {
    try {
      await sequelize.transaction(async () => {
        await req.article.destroy();
      });
      
      res.send({ status: 'ok' });
    } catch(err) {
      next(err);
    } 
  },
  
});

module.exports = ArticleController;
