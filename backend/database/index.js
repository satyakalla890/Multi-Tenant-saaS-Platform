const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Optional: test connection immediately
pool.connect()
  .then(client => {
    console.log(`✅ PostgreSQL connected to ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    client.release();
  })

  .catch(err => {
    console.error("❌ PostgreSQL connection error:", err.stack);
  });

module.exports = pool;
