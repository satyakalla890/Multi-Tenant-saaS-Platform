import { useState, useEffect } from "react";

export default function ProjectModal({ show, onClose, onSave, project }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "active",
      });
    } else {
      setForm({
        name: "",
        description: "",
        status: "active",
      });
    }
  }, [project]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  console.log("MODAL SUBMIT CLICKED");

  const payload = {
    name: form.name,
    description: form.description,
    status: form.status,
  };

  console.log("MODAL PAYLOAD:", payload);

  onSave(payload);
};

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{project ? "Edit Project" : "Create Project"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            id="project-name"
            name="name"
            placeholder="Project Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            id="project-description"
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
