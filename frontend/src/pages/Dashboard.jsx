import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import ProjectCard from "../components/ProjectCard";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState({});
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await API.get("/auth/me");
        setCurrentUser(userRes.data.data);

        const projectsRes = await API.get("/projects");
        setProjects(projectsRes.data.data.projects);

        // Assuming backend returns tasks for current user
        const tasksRes = await API.get(
          `/projects/${projectsRes.data.data.projects[0]?.id}/tasks`
        );
        setTasks(tasksRes.data.data.tasks || []);

        const completed = tasksRes.data.data.tasks.filter(
          (t) => t.status === "completed"
        ).length;

        setStats({
          totalTasks: tasksRes.data.data.total || 0,
          completedTasks: completed,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar currentUser={currentUser} />
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <div className="stats-section">
          <StatsCard title="Total Projects" value={projects.length} />
          <StatsCard title="Total Tasks" value={stats.totalTasks} />
          <StatsCard title="Completed Tasks" value={stats.completedTasks} />
          <StatsCard
            title="Pending Tasks"
            value={stats.totalTasks - stats.completedTasks}
          />
        </div>

        <h3>Recent Projects</h3>
        <div className="projects-section">
          {projects.slice(0, 5).map((p) => (
            <ProjectCard key={p.id} project={p} onClick={() => {}} />
          ))}
        </div>

        <h3>My Tasks</h3>
        <ul className="tasks-section">
          {tasks.map((t) => (
            <li key={t.id}>
              {t.title} | Priority: {t.priority} | Status: {t.status}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
