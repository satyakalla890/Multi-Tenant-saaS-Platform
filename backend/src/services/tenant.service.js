const pool = require("../config/db");

/**
 * API 5: Get Tenant Details
 */
exports.getTenantDetails = async (tenantId, currentUser) => {
  // Authorization
  if (
    currentUser.role !== "super_admin" &&
    currentUser.tenantId !== tenantId
  ) {
    throw { status: 403, message: "Unauthorized access" };
  }

  const tenantResult = await pool.query(
    `SELECT id, name, subdomain, status, subscription_plan,
            max_users, max_projects, created_at
     FROM tenants
     WHERE id = $1`,
    [tenantId]
  );

  if (tenantResult.rows.length === 0) {
    throw { status: 404, message: "Tenant not found" };
  }

  const tenant = tenantResult.rows[0];

  // Stats
  const usersCount = await pool.query(
    "SELECT COUNT(*) FROM users WHERE tenant_id = $1",
    [tenantId]
  );
  const projectsCount = await pool.query(
    "SELECT COUNT(*) FROM projects WHERE tenant_id = $1",
    [tenantId]
  );
  const tasksCount = await pool.query(
    "SELECT COUNT(*) FROM tasks WHERE tenant_id = $1",
    [tenantId]
  );

  return {
    id: tenant.id,
    name: tenant.name,
    subdomain: tenant.subdomain,
    status: tenant.status,
    subscriptionPlan: tenant.subscription_plan,
    maxUsers: tenant.max_users,
    maxProjects: tenant.max_projects,
    createdAt: tenant.created_at,
    stats: {
      totalUsers: Number(usersCount.rows[0].count),
      totalProjects: Number(projectsCount.rows[0].count),
      totalTasks: Number(tasksCount.rows[0].count),
    },
  };
};

/**
 * API 6: Update Tenant
 */
exports.updateTenant = async (tenantId, payload, currentUser) => {
  const allowedFieldsTenantAdmin = ["name"];
  const allowedFieldsSuperAdmin = [
    "name",
    "status",
    "subscriptionPlan",
    "maxUsers",
    "maxProjects",
  ];

  const updates = [];
  const values = [];
  let index = 1;

  for (const key in payload) {
    const isAllowed =
      currentUser.role === "super_admin"
        ? allowedFieldsSuperAdmin.includes(key)
        : allowedFieldsTenantAdmin.includes(key);

    if (!isAllowed) {
      throw { status: 403, message: "Unauthorized field update" };
    }

    const columnMap = {
      subscriptionPlan: "subscription_plan",
      maxUsers: "max_users",
      maxProjects: "max_projects",
    };

    updates.push(`${columnMap[key] || key} = $${index}`);
    values.push(payload[key]);
    index++;
  }

  if (updates.length === 0) {
    throw { status: 400, message: "No valid fields to update" };
  }

  const query = `
    UPDATE tenants
    SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${index}
    RETURNING id, name, updated_at
  `;

  values.push(tenantId);

  const result = await pool.query(query, values);

  return result.rows[0];
};

/**
 * API 7: List All Tenants (Super Admin)
 */
exports.listTenants = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Math.min(Number(query.limit) || 10, 100);
  const offset = (page - 1) * limit;

  const filters = [];
  const values = [];

  if (query.status) {
    values.push(query.status);
    filters.push(`status = $${values.length}`);
  }

  if (query.subscriptionPlan) {
    values.push(query.subscriptionPlan);
    filters.push(`subscription_plan = $${values.length}`);
  }

  const whereClause =
    filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const tenantsResult = await pool.query(
    `
    SELECT t.id, t.name, t.subdomain, t.status, t.subscription_plan,
           t.created_at,
           COUNT(DISTINCT u.id) AS total_users,
           COUNT(DISTINCT p.id) AS total_projects
    FROM tenants t
    LEFT JOIN users u ON u.tenant_id = t.id
    LEFT JOIN projects p ON p.tenant_id = t.id
    ${whereClause}
    GROUP BY t.id
    ORDER BY t.created_at DESC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
    `,
    [...values, limit, offset]
  );

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM tenants ${whereClause}`,
    values
  );

  return {
    tenants: tenantsResult.rows,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(countResult.rows[0].count / limit),
      totalTenants: Number(countResult.rows[0].count),
      limit,
    },
  };
};
