const db = require("../../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ===============================
// REGISTER TENANT
// ===============================
const registerTenant = async ({
  tenantName,
  subdomain,
  adminEmail,
  adminPassword,
  adminFullName,
}) => {
  // Check if subdomain exists
  const tenantCheck = await db.query(
    "SELECT id FROM tenants WHERE subdomain = $1",
    [subdomain]
  );
  if (tenantCheck.rows.length > 0) {
    throw new Error("Subdomain already exists");
  }

  // Create tenant with default values for NOT NULL columns
  const tenantRes = await db.query(
    `INSERT INTO tenants (name, subdomain, status, subscription_plan, max_users, max_projects)
     VALUES ($1, $2, 'active', 'free', 5, 3)
     RETURNING id`,
    [tenantName, subdomain]
  );

  const tenantId = tenantRes.rows[0].id;

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create admin user (ensure column is password_hash)
  await db.query(
    `INSERT INTO users
     (tenant_id, email, password_hash, full_name, role)
     VALUES ($1, $2, $3, $4, 'tenant_admin')`,
    [tenantId, adminEmail, hashedPassword, adminFullName]
  );

  return { tenantId };
};

// ===============================
// LOGIN
// ===============================
const login = async ({ email, password, subdomain }) => {
  const result = await db.query(
    `SELECT u.*, t.subdomain
     FROM users u
     JOIN tenants t ON t.id = u.tenant_id
     WHERE u.email = $1 AND t.subdomain = $2`,
    [email, subdomain]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      tenantId: user.tenant_id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token };
};

// ===============================
// GET CURRENT USER
// ===============================
const getCurrentUser = async (userId) => {
  const result = await db.query(
    `SELECT id, email, full_name, role, tenant_id
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};

// ✅ EXPORT ALL FUNCTIONS
module.exports = {
  registerTenant,
  login,
  getCurrentUser,
};
