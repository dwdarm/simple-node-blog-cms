module.exports = {
  development: {
    username: process.env.DB_USERNAME_DEV || "root",
    password: process.env.DB_PASSWORD_DEV || null,
    database: process.env.DB_DATABASE_DEV || "database_development",
    host: process.env.DB_HOST_DEV || "127.0.0.1",
    dialect: process.env.DB_DIALECT_DEV || "mysql"
  },
  test: {
    username: process.env.DB_USERNAME_TEST || "root",
    password: process.env.DB_PASSWORD_TEST || null,
    database: process.env.DB_DATABASE_TEST || "database_test",
    host: process.env.DB_HOST_TEST || "127.0.0.1",
    dialect: process.env.DB_DIALECT_TEST || "mysql",
    logging: false
  },
  production: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || "database_production",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false
  }
}
