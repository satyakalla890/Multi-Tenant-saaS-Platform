import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import ProjectCard from "../components/ProjectCard";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState({});
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // ✅ 1. Get current user
        const userRes = await API.get("/auth/me");
        setCurrentUser(userRes.data.data);

        // ✅ 2. Get all projects
        const projectsRes = await API.get("/projects");
        const projectsList = projectsRes.data.data.projects || [];

        setProjects(projectsList);

        // ✅ 3. Calculate dashboard stats from projects
        const totalTasks = projectsList.reduce(
          (sum, p) => sum + Number(p.task_count || 0),
          0
        );

        const completedTasks = projectsList.reduce(
          (sum, p) => sum + Number(p.completed_task_count || 0),
          0
        );

        setStats({
          totalTasks,
          completedTasks,
        });
      } catch (err) {
        console.error("Dashboard init error:", err);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <>
      <Navbar currentUser={currentUser} />

      <div className="dashboard-container">
        <h2>Dashboard</h2>

        {/* 📊 Stats */}
        <div className="stats-section">
          <StatsCard title="Total Projects" value={projects.length} />
          <StatsCard title="Total Tasks" value={stats.totalTasks} />
          <StatsCard title="Completed Tasks" value={stats.completedTasks} />
          <StatsCard
            title="Pending Tasks"
            value={stats.totalTasks - stats.completedTasks}
          />
        </div>

        {/* 📁 Recent Projects */}
        <h3>Recent Projects</h3>
        <div className="projects-section">
          {projects.slice(0, 5).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </>
  );
}