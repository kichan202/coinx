const { Pool } = require('pg');

// Use environment variables for safety
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'coinx',
  host: process.env.DB_HOST || 'db',   // 'db' is the service name in docker-compose.yml
  database: process.env.POSTGRES_DB || 'coinx_db',
  password: process.env.POSTGRES_PASSWORD || 'coinxpass',
  port: 5432,
});

module.exports = pool;