export default function ProjectCard({ project, onClick }) {
  return (
    <div className="project-card" onClick={() => onClick(project.id)}>
      <h3>{project.name}</h3>
      <p>Status: {project.status}</p>
      <p>Tasks: {project.taskCount}</p>
    </div>
  );
}
