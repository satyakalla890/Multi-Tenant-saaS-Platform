const pool = require("../config/db");
const { comparePassword } = require("../utils/password.util");
const { generateToken } = require("../utils/jwt.util");

/* ================= LOGIN ================= */
exports.login = async ({ email, password, subdomain }) => {
  const tenantResult = await pool.query(
    "SELECT * FROM tenants WHERE subdomain = $1",
    [subdomain]
  );

  if (tenantResult.rows.length === 0) {
    throw { status: 404, message: "Tenant not found" };
  }

  const tenant = tenantResult.rows[0];

  if (tenant.status !== "active") {
    throw { status: 403, message: "Tenant is suspended or inactive" };
  }

  const userResult = await pool.query(
    `SELECT * FROM users WHERE email = $1 AND tenant_id = $2`,
    [email, tenant.id]
  );

  if (userResult.rows.length === 0) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const user = userResult.rows[0];

  if (!user.is_active) {
    throw { status: 403, message: "Account is inactive" };
  }

  const passwordMatch = await comparePassword(password, user.password_hash);

  if (!passwordMatch) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const token = generateToken({
    userId: user.id,
    tenantId: user.tenant_id,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      tenantId: user.tenant_id,
    },
    token,
    expiresIn: 86400,
  };
};

/* ================= GET CURRENT USER ================= */
exports.getCurrentUser = async (userId) => {
  const result = await pool.query(
    `
    SELECT 
      u.id, u.email, u.full_name, u.role, u.is_active,
      t.id AS tenant_id, t.name, t.subdomain, 
      t.subscription_plan, t.max_users, t.max_projects
    FROM users u
    JOIN tenants t ON u.tenant_id = t.id
    WHERE u.id = $1
    `,
    [userId]
  );

  if (result.rows.length === 0) {
    throw { status: 404, message: "User not found" };
  }

  const row = result.rows[0];

  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    isActive: row.is_active,
    tenant: {
      id: row.tenant_id,
      name: row.name,
      subdomain: row.subdomain,
      subscriptionPlan: row.subscription_plan,
      maxUsers: row.max_users,
      maxProjects: row.max_projects,
    },
  };
};

/* ================= LOGOUT ================= */
exports.logout = async () => {
  // JWT-only auth → client deletes token
  return true;
};
