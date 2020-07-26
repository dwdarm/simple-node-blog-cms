const express = require('express');
const Routes = require('../app/config/routes');

module.exports = {
  init: (data) => {
    const server = express();
    Routes.init(server, data);
  
    return server;
  }
}


