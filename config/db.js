const dbConfig = {}

dbConfig.dialect = process.env.DATABASE_VENDOR || 'sqlite';

if (dbConfig.dialect === 'sqlite') {
  dbConfig.storage = process.env.DATABASE_HOST || '.database.sqlite';
} 
else {
  dbConfig.host = process.env.DATABASE_HOST;
}

module.exports = dbConfig;
