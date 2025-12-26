const pool = require("../config/db");
const { hashPassword } = require("../utils/password.util");

exports.createUser = async (tenantId, payload, currentUser) => {
  if (currentUser.role !== "tenant_admin") {
    throw { status: 403, message: "Not authorized" };
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check subscription limit
    const tenant = await client.query(
      "SELECT max_users FROM tenants WHERE id=$1",
      [tenantId]
    );

    const count = await client.query(
      "SELECT COUNT(*) FROM users WHERE tenant_id=$1",
      [tenantId]
    );

    if (parseInt(count.rows[0].count) >= tenant.rows[0].max_users) {
      throw { status: 403, message: "Subscription limit reached" };
    }

    const { email, password, fullName, role = "user" } = payload;

    const hashed = await hashPassword(password);

    const result = await client.query(
      `INSERT INTO users
       (tenant_id, email, password_hash, full_name, role)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id,email,full_name,role,tenant_id,is_active,created_at`,
      [tenantId, email, hashed, fullName, role]
    );

    await client.query(
      `INSERT INTO audit_logs (tenant_id, user_id, action)
       VALUES ($1,$2,'CREATE_USER')`,
      [tenantId, currentUser.userId]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

exports.listUsers = async (tenantId, query) => {
  const { search, role, page = 1, limit = 50 } = query;
  const offset = (page - 1) * limit;

  let filters = `WHERE tenant_id=$1`;
  const params = [tenantId];

  if (search) {
    params.push(`%${search}%`);
    filters += ` AND (email ILIKE $${params.length} OR full_name ILIKE $${params.length})`;
  }

  if (role) {
    params.push(role);
    filters += ` AND role=$${params.length}`;
  }

  const users = await pool.query(
    `SELECT id,email,full_name,role,is_active,created_at
     FROM users ${filters}
     ORDER BY created_at DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );

  return users.rows;
};

exports.updateUser = async (userId, payload, currentUser) => {
  if (
    payload.role || payload.isActive !== undefined
  ) {
    if (currentUser.role !== "tenant_admin") {
      throw { status: 403, message: "Not authorized" };
    }
  }

  const result = await pool.query(
    `UPDATE users
     SET full_name=COALESCE($1,full_name),
         role=COALESCE($2,role),
         is_active=COALESCE($3,is_active),
         updated_at=NOW()
     WHERE id=$4 AND tenant_id=$5
     RETURNING id,full_name,role,updated_at`,
    [
      payload.fullName,
      payload.role,
      payload.isActive,
      userId,
      currentUser.tenantId,
    ]
  );

  if (!result.rows.length) {
    throw { status: 404, message: "User not found" };
  }

  return result.rows[0];
};

exports.deleteUser = async (userId, currentUser) => {
  if (currentUser.role !== "tenant_admin") {
    throw { status: 403, message: "Not authorized" };
  }

  if (userId === currentUser.userId) {
    throw { status: 403, message: "Cannot delete self" };
  }

  const res = await pool.query(
    "DELETE FROM users WHERE id=$1 AND tenant_id=$2",
    [userId, currentUser.tenantId]
  );

  if (!res.rowCount) throw { status: 404, message: "User not found" };
};
