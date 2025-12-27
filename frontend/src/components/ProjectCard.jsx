export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="project-card">
      <h3>{project.name}</h3>
      <p>{project.description?.substring(0, 50)}...</p>
      <p>Status: {project.status}</p>
      <p>Tasks: {project.taskCount}</p>
      <p>Created By: {project.createdBy?.fullName || "Unknown"}</p>
      <p>Created At: {new Date(project.createdAt).toLocaleDateString()}</p>
      <div className="actions">
        <button onClick={() => onEdit(project)}>Edit</button>
        <button onClick={() => onDelete(project.id)}>Delete</button>
      </div>
    </div>
  );
}
