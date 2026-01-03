const bcrypt = require("bcrypt");
const pool = require("../../src/config/db");

async function seed() {
  const passwordHash = await bcrypt.hash("Admin@123", 10);

  // Super Admin
  const superAdminRes = await pool.query(`
    INSERT INTO users (id, email, password_hash, role, tenant_id, full_name)
    VALUES (gen_random_uuid(), 'superadmin@system.com', $1, 'super_admin', NULL, 'Super Admin')
    ON CONFLICT DO NOTHING
    RETURNING id
  `, [passwordHash]);

  const superAdminId = superAdminRes.rows?.[0]?.id;

  // Tenant
  const tenantRes = await pool.query(`
    INSERT INTO tenants (id, name, subdomain, status, subscription_plan)
    VALUES (gen_random_uuid(), 'Demo Tenant', 'demo', 'active', 'free')
    RETURNING id
  `);
  const tenantId = tenantRes.rows[0].id;

  // Tenant Admin
  const tenantAdminRes = await pool.query(`
    INSERT INTO users (id, email, password_hash, role, tenant_id, full_name)
    VALUES (gen_random_uuid(), 'admin@demo.com', $1, 'tenant_admin', $2, 'Tenant Admin')
    RETURNING id
  `, [passwordHash, tenantId]);
  const tenantAdminId = tenantAdminRes.rows[0].id;

  // Regular User
  await pool.query(`
    INSERT INTO users (id, email, password_hash, role, tenant_id, full_name)
    VALUES (gen_random_uuid(), 'user@demo.com', $1, 'user', $2, 'Regular User')
  `, [passwordHash, tenantId]);

  // Project (assign tenant_admin as creator)
  const projectRes = await pool.query(`
    INSERT INTO projects (id, name, tenant_id, status, created_by, created_at, updated_at)
    VALUES (gen_random_uuid(), 'Demo Project', $1, 'active', $2, NOW(), NOW())
    RETURNING id
  `, [tenantId, tenantAdminId]);
  const projectId = projectRes.rows[0].id;

  // Task (add tenant_id from project)
  await pool.query(`
    INSERT INTO tasks (id, title, project_id, tenant_id, status, priority)
    VALUES (gen_random_uuid(), 'Initial Task', $1, $2, 'todo', 'medium')
  `, [projectId, tenantId]);

  console.log("🌱 Seed data inserted successfully");
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seeding failed", err);
  process.exit(1);
});
