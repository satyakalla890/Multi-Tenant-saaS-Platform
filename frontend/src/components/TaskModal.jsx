import { useEffect, useState } from "react";
import API from "../services/api";

export default function TaskModal({ show, onClose, onSave, task }) {
  const tenantId = localStorage.getItem("tenantId");

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    assigned_to: "",
  });

  // 🔹 Load users
  useEffect(() => {
    API.get(`/tenants/${tenantId}/users`)
      .then((res) => setUsers(res.data.data.users));
  }, []);

  // 🔹 Fill form when editing
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        status: task.status || "todo",
        assigned_to: task.assigned_to || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        assigned_to: "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description || null,
      priority: form.priority,
      status: form.status,
      assignedTo: form.assigned_to || null, // ✅ backend expects camelCase
    };

    onSave(payload);
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{task ? "Edit Task" : "Create New Task"}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-light)' }}>Title</label>
            <input
              name="title"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-light)' }}>Description</label>
            <textarea
              name="description"
              placeholder="Add more details..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-light)' }}>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-light)' }}>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-light)' }}>Assignee</label>
            <select
              name="assigned_to"
              value={form.assigned_to}
              onChange={handleChange}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button className="btn btn-outline" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              {task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
