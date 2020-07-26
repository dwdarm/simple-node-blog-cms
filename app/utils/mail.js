const nodemailer = require('nodemailer');

class Mail {
  
  constructor(options = {}) {
    this.transport = nodemailer.createTransport({
      host: options.host,
      port: options.port,
      auth: {
        user: options.username,
        pass: options.password
      }
    });
  }
  
  send(data = {}) {
    const transport = this.transport;
    return new Promise((resolve, reject) => {
      transport.sendMail(data, (err, info) => {
        if (err) {
          return reject(err);
        }
    
        resolve(info);
      });
    });
  }
  
}

module.exports = Mail;
