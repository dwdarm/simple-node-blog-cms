const express = require('express');
const path = require('path');

const StaticRoute = ({ router }) => {
  router.use(express.static(path.join(__dirname, '../public'), {index:false}));
    
  router.get('*', (req, res) => {
    res.sendFile('index.html', {
      root: path.join(__dirname, '../public')
    });
  });
}

module.exports = StaticRoute;
