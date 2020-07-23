'use strict';

const fs = require('fs');
const path = require('path');
const server = require('./server');
const db = require('./db');
const mail = require('./mail');
const env = process.env.NODE_ENV || 'development';
const config = require('../app/config/config.js')[env];
const middlewaresDir = path.join(__dirname, '../app/middlewares');
const controllersDir = path.join(__dirname, '../app/controllers');
const routesDir = path.join(__dirname, '../app/routes');
const data = { db, mail, config, server, router: server }

const initComponent = ({ data, dir }) => {
  const results = {};
  fs
    .readdirSync(dir)
    .filter(file => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
    .forEach(file => {
      const component = require(path.join(dir, file));
      results[component.name] = component(data);
    });
    
  return results;
}

data.middlewares = initComponent({ data, dir: middlewaresDir });
data.controllers = initComponent({ data, dir: controllersDir });

require('../app/config/middlewares')(data);

initComponent({ data, dir: routesDir });

require('../app/config/error')(data);

module.exports = data;


