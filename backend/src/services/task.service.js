const pool = require("../config/db");

exports.createTask = async (projectId, payload, user) => {
  const {
    title,
    description,
    assignedTo = null,
    priority = "medium",
    dueDate = null,
  } = payload;

  if (!title) {
    throw { status: 400, message: "Task title required" };
  }

  // ✅ Verify project belongs to tenant
  const projectRes = await pool.query(
    "SELECT tenant_id FROM projects WHERE id=$1",
    [projectId]
  );

  if (!projectRes.rows.length) {
    throw { status: 404, message: "Project not found" };
  }

  if (projectRes.rows[0].tenant_id !== user.tenantId) {
    throw { status: 403, message: "Access denied" };
  }

  // ✅ Validate assigned user
  let assignedUserId = null;
  if (assignedTo) {
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE id=$1 AND tenant_id=$2",
      [assignedTo, user.tenantId]
    );

    if (!userCheck.rows.length) {
      throw { status: 400, message: "Invalid assigned user" };
    }

    assignedUserId = assignedTo;
  }

  const result = await pool.query(
    `INSERT INTO tasks
     (project_id, tenant_id, title, description, status, priority, assigned_to, due_date)
     VALUES ($1,$2,$3,$4,'todo',$5,$6,$7)
     RETURNING *`,
    [
      projectId,
      user.tenantId,
      title,
      description || null,
      priority,
      assignedUserId,
      dueDate,
    ]
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

exports.deleteTask = async (taskId, user) => {
  const result = await pool.query(
    `DELETE FROM tasks
     WHERE id=$1 AND tenant_id=$2`,
    [taskId, user.tenantId]
  );

  if (!result.rowCount) {
    throw { status: 403, message: "Task not found or access denied" };
  }
};

exports.updateTask = async (taskId, payload, user) => {
  const {
    title,
    description,
    priority,
    status,
    assignedTo
  } = payload;

  const result = await pool.query(
    `UPDATE tasks
     SET title=$1,
         description=$2,
         priority=$3,
         status=$4,
         assigned_to=$5,
         updated_at=NOW()
     WHERE id=$6 AND tenant_id=$7
     RETURNING *`,
    [
      title,
      description,
      priority,
      status,
      assignedTo,
      taskId,
      user.tenantId
    ]
  );

  if (!result.rows.length) {
    throw { status: 403, message: "Task update not allowed" };
  }

  return result.rows[0];
};
