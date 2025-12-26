const db = require("../config/db");

exports.createProject = async ({ tenantId, userId, name, description }) => {
  const projectCount = await db.query(
    "SELECT COUNT(*) FROM projects WHERE tenant_id=$1",
    [tenantId]
  );

  const tenant = await db.query(
    "SELECT max_projects FROM tenants WHERE id=$1",
    [tenantId]
  );

  if (parseInt(projectCount.rows[0].count) >= tenant.rows[0].max_projects) {
    throw { status: 403, message: "Project limit reached" };
  }

  const result = await db.query(
    `INSERT INTO projects (tenant_id, name, description, created_by)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [tenantId, name, description || null, userId]
  );

  return result.rows[0];
};

exports.getProjects = async ({ tenantId, status, search, limit, offset }) => {
  let query = `
    SELECT p.*, u.full_name,
      (SELECT COUNT(*) FROM tasks t WHERE t.project_id=p.id) AS task_count,
      (SELECT COUNT(*) FROM tasks t WHERE t.project_id=p.id AND t.status='completed') AS completed_task_count
    FROM projects p
    JOIN users u ON u.id=p.created_by
    WHERE p.tenant_id=$1
  `;
  const values = [tenantId];

  if (status) {
    values.push(status);
    query += ` AND p.status=$${values.length}`;
  }

  if (search) {
    values.push(`%${search}%`);
    query += ` AND p.name ILIKE $${values.length}`;
  }

  query += " ORDER BY p.created_at DESC LIMIT $2 OFFSET $3";

  const result = await db.query(query, [tenantId, limit, offset]);
  return result.rows;
};

exports.getProjectById = async (projectId) => {
  const result = await db.query(
    "SELECT * FROM projects WHERE id=$1",
    [projectId]
  );
  return result.rows[0];
};

exports.updateProject = async (projectId, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  const setClause = keys
    .map((key, index) => `${key}=$${index + 1}`)
    .join(",");

  const result = await db.query(
    `UPDATE projects SET ${setClause}, updated_at=NOW()
     WHERE id=$${keys.length + 1} RETURNING *`,
    [...values, projectId]
  );

  return result.rows[0];
};

exports.deleteProject = async (projectId) => {
  await db.query("DELETE FROM projects WHERE id=$1", [projectId]);
};
