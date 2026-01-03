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
        <h3>{task ? "Edit Task" : "Add Task"}</h3>

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Task title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

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

          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
