const fs = require("fs");
const path = require("path");
const pool = require("../../src/config/db");

const migrationsDir = path.join(process.cwd(), "database/migrations");

async function runMigrations() {
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
  console.error("❌ Migration failed", err);
  process.exit(1);
});
