require('dotenv').config();

const defaultConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_CONNECTION,
  storage: process.env.DB_SQLITE_DATABASE,
  logging: process.env.DB_LOG === 'true' ? console.log : false
}

module.exports = {
  
  development: {
    ...defaultConfig,
    database: process.env.DB_DATABASE + '_dev',
    storage: process.env.DB_SQLITE_DATABASE + '_dev'
  },
  
  test: {
    ...defaultConfig,
    database: process.env.DB_DATABASE + '_test',
    storage: process.env.DB_SQLITE_DATABASE + '_test'
  },
  
  production: {
    ...defaultConfig
  }
  
}
