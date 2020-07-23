module.exports = {
  development: {
    username: process.env.DB_USERNAME_DEV || "root",
    password: process.env.DB_PASSWORD_DEV || null,
    database: process.env.DB_DATABASE_DEV || "database_development",
    host: process.env.DB_HOST_DEV || "127.0.0.1",
    dialect: process.env.DB_DIALECT_DEV || "mysql",
    email_host: process.env.EMAIL_HOST_DEV || "",
    email_port: process.env.EMAIL_PORT_DEV || "",
    email_username: process.env.EMAIL_USERNAME_DEV || "",
    email_password: process.env.EMAIL_PASSWORD_DEV || "",
    email_sender: process.env.EMAIL_SENDER_DEV || "",
    url_base: process.env.URL_BASE_DEV || "",
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
    email_host: process.env.EMAIL_HOST || "",
    email_port: process.env.EMAIL_PORT || "",
    email_username: process.env.EMAIL_USERNAME || "",
    email_password: process.env.EMAIL_PASSWORD || "",
    email_sender: process.env.EMAIL_SENDER || "",
    url_base: process.env.URL_BASE || "",
    logging: false
  }
}
