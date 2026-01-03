import { useEffect, useState } from "react";
import { getProjects, createProject, updateProject, deleteProject } from "../services/api";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");

  const fetchProjects = async () => {
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (search) params.search = search;
    const res = await getProjects(params);
    setProjects(res.data.data.projects);
  };

  useEffect(() => { fetchProjects(); }, [filterStatus, search]);

  const handleSave = async (projectData) => {
    console.log("UPDATE PAYLOAD:", projectData);

    if (editingProject) {
      await updateProject(editingProject.id, projectData);
    } else {
      await createProject(projectData);
    }
    setModalOpen(false);
    setEditingProject(null);
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
      fetchProjects();
    }
  };

  return (
    <div className="projects-page">
      <h2>Projects</h2>
      <div className="controls">
        <button onClick={() => setModalOpen(true)}>Create New Project</button>
        <input placeholder="Search by name" value={search} onChange={(e)=>setSearch(e.target.value)} />
        <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="projects-list">
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onEdit={(proj) => {
                setEditingProject({
                  id: proj.id,
                  name: proj.name,
                  description: proj.description,
                  status: proj.status,
                });
                setModalOpen(true);
              }}

              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <ProjectModal
        show={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProject(null); }}
        onSave={handleSave}
        project={editingProject}
      />
    </div>
  );
}
