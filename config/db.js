const dbConfig = {}

if (!process.env.DATABASE_URL) {
  dbConfig.dialect = process.env.DATABASE_VENDOR || 'sqlite';

  if (dbConfig.dialect === 'sqlite') {
    dbConfig.storage = process.env.DATABASE_HOST || '.database.sqlite';
  } 
  else {
    dbConfig.host = process.env.DATABASE_HOST;
    dbConfig.database = process.env.DATABASE_DB;
    dbConfig.username = process.env.DATABASE_USER;
    dbConfig.database = process.env.DATABASE_DB;
  }
}

dbConfig.logging = 
  process.env.NODE_ENV === 'development' ? console.log : false ;

module.exports = dbConfig;
