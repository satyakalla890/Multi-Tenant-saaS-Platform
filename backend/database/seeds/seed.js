require('dotenv').config();
const bcrypt = require("bcrypt");
const pool = require("../../src/config/db");

const hash = (p) => bcrypt.hash(p, 10);

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // SUPER ADMIN
    const saEmail = "superadmin@system.com";
    const saPwd = await hash("Admin@123");

    const sa = await client.query(
      "SELECT id FROM users WHERE email=$1",
      [saEmail]
    );

    if (sa.rowCount === 0) {
      await client.query(
        "INSERT INTO users (email, password_hash, role, full_name) VALUES ($1, $2, 'super_admin', 'System Admin')",
        [saEmail, saPwd]
      );
    }

    // TENANT
    let tenantId;
    const tenant = await client.query(
      "SELECT id FROM tenants WHERE subdomain='demo'"
    );

    if (tenant.rowCount === 0) {
      const res = await client.query(
        `INSERT INTO tenants (name, subdomain, status, subscription_plan)
         VALUES ('Demo Company', 'demo', 'active', 'pro')
         RETURNING id`
      );
      tenantId = res.rows[0].id;
    } else {
      tenantId = tenant.rows[0].id;
    }

    // TENANT ADMIN
    const adminEmail = "admin@demo.com";
    const adminPwd = await hash("Demo@123");

    let adminId;
    const adminCheck = await client.query(
      "SELECT id FROM users WHERE email=$1 AND tenant_id=$2",
      [adminEmail, tenantId]
    );

    if (adminCheck.rowCount === 0) {
      const res = await client.query(
        `INSERT INTO users (email, password_hash, role, tenant_id, full_name)
         VALUES ($1, $2, 'tenant_admin', $3, 'Demo Admin')
         RETURNING id`,
        [adminEmail, adminPwd, tenantId]
      );
      adminId = res.rows[0].id;
    } else {
      adminId = adminCheck.rows[0].id;
    }

    // USERS
    const users = [
      ["user1@demo.com", "User One"],
      ["user2@demo.com", "User Two"]
    ];
    for (const [email, name] of users) {
      const u = await client.query(
        "SELECT id FROM users WHERE email=$1 AND tenant_id=$2",
        [email, tenantId]
      );

      if (u.rowCount === 0) {
        await client.query(
          `INSERT INTO users (email, password_hash, role, tenant_id, full_name)
           VALUES ($1, $2, 'user', $3, $4)`,
          [email, await hash("User@123"), tenantId, name]
        );
      }
    }

    // PROJECTS
    const projects = [
      ["Project Alpha", "First demo project"],
      ["Project Beta", "Second demo project"]
    ];

    for (const [name, desc] of projects) {
      const p = await client.query(
        "SELECT id FROM projects WHERE name=$1 AND tenant_id=$2",
        [name, tenantId]
      );

      if (p.rowCount === 0) {
        await client.query(
          `INSERT INTO projects (name, description, tenant_id, status, created_by)
           VALUES ($1, $2, $3, 'active', $4)`,
          [name, desc, tenantId, adminId]
        );
      }
    }

    await client.query("COMMIT");
    console.log("✅ Seed completed safely");
  } catch (e) {
    if (client) await client.query("ROLLBACK");
    console.error("❌ Seed failed:", e.message);
  } finally {
    if (client) client.release();
    process.exit(0);
  }
}

seed();
