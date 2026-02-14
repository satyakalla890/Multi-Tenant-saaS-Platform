export default function ProjectCard({ project, onEdit, onDelete }) {
  const statusColor = {
    active: '#dcfce7',
    archived: '#f1f5f9',
    completed: '#e0f2fe'
  }[project.status] || '#f1f5f9';

  const statusTextColor = {
    active: '#16a34a',
    archived: '#475569',
    completed: '#0284c7'
  }[project.status] || '#475569';

  return (
    <div className="project-card">
      <div className="section-header" style={{ marginBottom: '0.5rem' }}>
        <h3>{project.name}</h3>
        <span
          className="badge"
          style={{ background: statusColor, color: statusTextColor, margin: 0 }}
        >
          {project.status}
        </span>
      </div>

      <p style={{ minHeight: '3rem' }}>{project.description || "No description provided."}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '1rem' }}>
        <span>Tasks: <strong>{project.task_count ?? 0}</strong></span>
        <span>By: <strong>{project.full_name || "Admin"}</strong></span>
      </div>

      <div className="actions">
        <button className="btn btn-outline" onClick={() => onEdit(project)}>Edit</button>
        <button className="btn btn-danger" onClick={() => onDelete(project.id)}>Delete</button>
        <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={() => {
          localStorage.setItem("activeProjectId", project.id);
          window.location.href = `/projects/${project.id}/tasks`;
        }}>
          View Tasks
        </button>
      </div>
    </div>
  );
}

