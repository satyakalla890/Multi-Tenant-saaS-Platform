const pool = require("../config/db");
const { hashPassword } = require("../utils/password.util");

exports.registerTenant = async (payload) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      tenantName,
      subdomain,
      adminEmail,
      adminPassword,
      adminFullName,
    } = payload;

    // Check subdomain
    const tenantCheck = await client.query(
      "SELECT id FROM tenants WHERE subdomain = $1",
      [subdomain]
    );
    if (tenantCheck.rows.length > 0) {
      throw { status: 409, message: "Subdomain already exists" };
    }

    // Create tenant
    const tenantResult = await client.query(
      `INSERT INTO tenants 
       (name, subdomain, status, subscription_plan, max_users, max_projects)
       VALUES ($1, $2, 'active', 'free', 5, 3)
       RETURNING id`,
      [tenantName, subdomain]
    );

    const tenantId = tenantResult.rows[0].id;

    // Hash password
    const passwordHash = await hashPassword(adminPassword);

    // Create admin user
    const userResult = await client.query(
      `INSERT INTO users
       (tenant_id, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, 'tenant_admin')
       RETURNING id, email, full_name, role`,
      [tenantId, adminEmail, passwordHash, adminFullName]
    );

    await client.query("COMMIT");

    return {
      tenantId,
      subdomain,
      adminUser: userResult.rows[0],
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
