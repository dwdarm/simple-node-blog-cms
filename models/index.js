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
  
  sequelize.sync().catch(err => console.error(err));
  
  return { User, Article, Category, Tag }
}
