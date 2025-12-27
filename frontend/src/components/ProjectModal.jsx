import { useState, useEffect } from "react";

export default function ProjectModal({ show, onClose, onSave, project }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    if (project) setForm({ ...project });
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{project ? "Edit Project" : "Create Project"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Project Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="completed">Completed</option>
          </select>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
