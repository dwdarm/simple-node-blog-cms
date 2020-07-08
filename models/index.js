module.exports = sequelize => {
  const User = require('./user')(sequelize);
  const Article = require('./article')(sequelize);
  const Category = require('./category')(sequelize);
  const Tag = require('./tag')(sequelize);
  
  User.hasMany(Article);
  Article.belongsTo(User);
  
  Article.belongsToMany(Category, { through: 'PostCategories' });
  Category.belongsToMany(Article, { through: 'PostCategories' });
  
  Article.belongsToMany(Tag, { through: 'PostTags' });
  Tag.belongsToMany(Article, { through: 'PostTags' });
  
  // solution from JamesMGreene (https://github.com/sequelize/sequelize/issues/9481)
  sequelize.addHook('beforeCount', function (options) {
    if (this._scope.include && this._scope.include.length > 0) {
      options.distinct = true
      options.col = this._scope.col || options.col || `"${this.options.name.singular}".id`
    }

    if (options.include && options.include.length > 0) {
      let isInnerJoin = false;
      options.include.forEach(e => {
        if (typeof e === 'object') {
          if (typeof e.where === 'object') {
            isInnerJoin = true;
          }
        }
      });
      
      if (!isInnerJoin) {
        options.include = null;
      }
    }
  })
  
  sequelize.sync().catch(err => console.error(err));
  
  return { User, Article, Category, Tag }
}
