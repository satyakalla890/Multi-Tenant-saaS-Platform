export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="project-card">
      <h3>{project.name}</h3>
      <p>{project.description?.substring(0, 50)}...</p>
      <p>Status: {project.status}</p>
      <p>Tasks: {project.task_count ?? 0}</p>

      <p>
        Created By: {project.full_name || "Unknown"}
      </p>

      <p>
        Created At:{" "}
        {project.created_at
          ? new Date(project.created_at).toLocaleDateString()
          : "N/A"}
      </p>

      <div className="actions">
        <button onClick={() => onEdit(project)}>Edit</button>
        <button onClick={() => onDelete(project.id)}>Delete</button>
        <button onClick={() => {
          localStorage.setItem("activeProjectId", project.id);
          window.location.href = `/projects/${project.id}/tasks`;

        }}>
        View Tasks
        </button>
      </div>
    </div>
  );
}
