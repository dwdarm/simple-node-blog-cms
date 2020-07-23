const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'thisissecret';

const generateToken = payload => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, {
      expiresIn: '7d'
    }, (err, token) => {
      if (err) {
        return reject(err);
      }

      resolve(token);
    })
  });
}

const verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      resolve(decoded);
    });
  });
}

module.exports = {
  generateToken,
  verifyToken
}