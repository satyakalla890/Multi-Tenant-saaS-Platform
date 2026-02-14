require('dotenv').config();
const fs = require("fs");
const path = require("path");
const pool = require("../../src/config/db");


const migrationsDir = path.join(process.cwd(), "database/migrations");

async function runMigrations() {
  console.log(`📡 Connecting to ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}...`);
  const files = fs

    .readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    console.log(`📄 Running migration: ${file}`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    await pool.query(sql);
  }

  console.log("✅ All migrations executed");
  process.exit(0);
}

runMigrations().catch(err => {
  console.error("❌ Migration failed");
  console.error("Error Message:", err.message);
  console.error("Error Detail:", err.detail);
  console.error("Error Code:", err.code);
  process.exit(1);
});

