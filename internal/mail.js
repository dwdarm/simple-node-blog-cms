const env = process.env.NODE_ENV || 'development';
const config = require('../app/config/config.js')[env];
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  host: config.email_host,
  port: config.email_port,
  auth: {
    user: config.email_username,
    pass: config.email_password
  }
});

const sendMail = (options = {}) => new Promise((resolve, reject) => {
  if (env === 'test') { return resolve(); }
  
  transport.sendMail({ ...options, from: config.email_sender }, (err, info) => {
    if (err) {
      return reject(err);
    }
    
    resolve(info);
  });
});

module.exports = { sendMail }
