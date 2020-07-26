'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const cls = require('cls-hooked');
const env = process.env.NODE_ENV || 'development';
const config = require('../app/config/database.js')[env];

const MODELS_DIR = path.join(__dirname, '../app/db/models');
const MODEL_EXT = '.js';

module.exports = {
  init: () => {
    const namespace = cls.createNamespace('database-transaction');
    Sequelize.useCLS(namespace);
    
    const sequelize = new Sequelize(
      config.database, 
      config.username, 
      config.password, 
      config
    );
    
    const db = {};
    fs.readdirSync(MODELS_DIR)
    .filter(file => (file.indexOf('.') !== 0) && (file.slice(MODEL_EXT.length*-1) === MODEL_EXT))
    .forEach((file) => {
      const model = require(path.join(MODELS_DIR, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });
      
    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
    
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
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    
    return db;
  }
};
