'use strict';

const fs = require('fs');
const Server = require('./server');
const DB = require('./db');

const path = require('path');
const MIDDLEWARES_DIR = path.join(__dirname, '../app/http/middlewares');
const CONTROLLERS_DIR = path.join(__dirname, '../app/http/controllers');

const MIDDLEWARE_EXT = '.middleware.js';
const CONTROLLER_EXT = '.controller.js';

module.exports = { 
  init: () => {
    const db = DB.init();
    
    const middlewares = {}
    fs.readdirSync(MIDDLEWARES_DIR)
    .filter(file => (file.indexOf('.') !== 0) && (file.slice(MIDDLEWARE_EXT.length*-1) === MIDDLEWARE_EXT))
    .forEach((file) => {
      const middleware = require(path.join(MIDDLEWARES_DIR, file));
      middlewares[middleware.name] = middleware(db);
    });
    
    const controllers = {}
    fs.readdirSync(CONTROLLERS_DIR)
    .filter(file => (file.indexOf('.') !== 0) && (file.slice(CONTROLLER_EXT.length*-1) === CONTROLLER_EXT))
    .forEach((file) => {
      const controller = require(path.join(CONTROLLERS_DIR, file));
      controllers[controller.name] = controller(db);
    });
    
    const server = Server.init({ controllers, middlewares });
    
    return { db, server }
  }
}


