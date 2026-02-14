import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API, { deleteProject, updateProject } from "../services/api";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState({});
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchInitialData = async () => {
    try {
      const userRes = await API.get("/auth/me");
      setCurrentUser(userRes.data.data);

      const projectsRes = await API.get("/projects");
      const projectsList = projectsRes.data.data.projects || [];
      setProjects(projectsList);

      const totalTasks = projectsList.reduce((sum, p) => sum + Number(p.task_count || 0), 0);
      const completedTasks = projectsList.reduce((sum, p) => sum + Number(p.completed_task_count || 0), 0);
      setStats({ totalTasks, completedTasks });
    } catch (err) {
      console.error("Dashboard init error:", err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        fetchInitialData();
      } catch (err) {
        alert("Failed to delete project");
      }
    }
  };

  const handleSave = async (projectData) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectData);
      }
      setModalOpen(false);
      setEditingProject(null);
      fetchInitialData();
    } catch (err) {
      alert("Failed to save changes");
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      <Navbar currentUser={currentUser} />

      <div className="dashboard-container">
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>
            Welcome back, {currentUser.fullName?.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
            Here's what's happening with your projects today.
          </p>
        </header>

        {/* 📊 Stats Section */}
        <section className="stats-section">
          <StatsCard title="Total Projects" value={projects.length} />
          <StatsCard title="Total Tasks" value={stats.totalTasks} />
          <StatsCard title="Completed" value={stats.completedTasks} />
          <StatsCard title="Active Tasks" value={stats.totalTasks - stats.completedTasks} />
        </section>

        {/* 📁 Recent Projects Section */}
        <section>
          <div className="section-header">
            <h3>Recent Projects</h3>
            <Link to="/projects" className="view-all-link">
              View All Projects <span>&rarr;</span>
            </Link>
          </div>

          <div className="projects-section">
            {projects.length > 0 ? (
              projects.slice(0, 3).map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onEdit={(proj) => {
                    setEditingProject(proj);
                    setModalOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: '16px', gridColumn: '1 / -1' }}>
                <p style={{ color: 'var(--text-light)' }}>No projects found. Create your first one to get started!</p>
                <Link to="/projects" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
                  Create Project
                </Link>
              </div>
            )}
          </div>
        </section>
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
