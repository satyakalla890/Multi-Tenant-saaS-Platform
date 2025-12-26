const pool = require("../config/db");

exports.createTask = async (projectId, payload, user) => {
  const { title, description, assignedTo, priority = "medium", dueDate } = payload;

  // 1️⃣ Verify project belongs to tenant
  const projectRes = await pool.query(
    "SELECT id, tenant_id FROM projects WHERE id=$1",
    [projectId]
  );
  if (!projectRes.rows.length || projectRes.rows[0].tenant_id !== user.tenantId) {
    throw { status: 403, message: "Project access denied" };
  }

  // 2️⃣ Verify assigned user belongs to same tenant
  if (assignedTo) {
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE id=$1 AND tenant_id=$2",
      [assignedTo, user.tenantId]
    );
    if (!userCheck.rows.length) {
      throw { status: 400, message: "Assigned user not in tenant" };
    }
  }

  // 3️⃣ Insert task
  const result = await pool.query(
    `INSERT INTO tasks
     (project_id, tenant_id, title, description, status, priority, assigned_to, due_date)
     VALUES ($1,$2,$3,$4,'todo',$5,$6,$7)
     RETURNING *`,
    [projectId, user.tenantId, title, description, priority, assignedTo, dueDate]
  );

  return result.rows[0];
};

exports.listTasks = async (projectId, user, query) => {
  const { status, assignedTo, priority, search, page = 1, limit = 50 } = query;
  const offset = (page - 1) * limit;

  let conditions = [`t.project_id=$1`, `t.tenant_id=$2`];
  let values = [projectId, user.tenantId];
  let idx = 3;

  if (status) { conditions.push(`t.status=$${idx++}`); values.push(status); }
  if (priority) { conditions.push(`t.priority=$${idx++}`); values.push(priority); }
  if (assignedTo) { conditions.push(`t.assigned_to=$${idx++}`); values.push(assignedTo); }
  if (search) { conditions.push(`t.title ILIKE $${idx++}`); values.push(`%${search}%`); }

  const tasks = await pool.query(
    `SELECT t.*, u.id as user_id, u.full_name, u.email
     FROM tasks t
     LEFT JOIN users u ON u.id = t.assigned_to
     WHERE ${conditions.join(" AND ")}
     ORDER BY t.priority DESC, t.due_date ASC
     LIMIT $${idx++} OFFSET $${idx}`,
    [...values, limit, offset]
  );

  return tasks.rows;
};

exports.updateTaskStatus = async (taskId, status, user) => {
  const res = await pool.query(
    `UPDATE tasks
     SET status=$1, updated_at=NOW()
     WHERE id=$2 AND tenant_id=$3
     RETURNING id,status,updated_at`,
    [status, taskId, user.tenantId]
  );
  if (!res.rows.length) throw { status: 403, message: "Task access denied" };
  return res.rows[0];
};
