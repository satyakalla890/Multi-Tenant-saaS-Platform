import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, updateProject, deleteProject } from "../services/projectService";
import { getProjectTasks, createTask, updateTaskStatus, deleteTask } from "../services/taskService";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, []);

  const fetchProject = async () => {
    const res = await getProjectById(projectId);
    setProject(res.data.data);
  };

  const fetchTasks = async () => {
    const res = await getProjectTasks(projectId);
    setTasks(res.data.data.tasks);
  };

  const handleCreateTask = async () => {
    if (!newTask) return;
    await createTask(projectId, { title: newTask });
    setNewTask("");
    fetchTasks();
  };

  const handleStatusChange = async (taskId, status) => {
    await updateTaskStatus(taskId, status);
    fetchTasks();
  };

  const handleDeleteProject = async () => {
    await deleteProject(projectId);
    navigate("/projects");
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div>
      <h2>{project.name}</h2>
      <p>Status: {project.status}</p>
      <p>{project.description}</p>

      <button onClick={handleDeleteProject}>Delete Project</button>

      <hr />

      <h3>Tasks</h3>

      <input
        placeholder="New task title"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={handleCreateTask}>Add Task</button>

      {tasks.map((task) => (
        <div key={task.id}>
          <strong>{task.title}</strong> | {task.status}
          <button onClick={() => handleStatusChange(task.id, "completed")}>
            Complete
          </button>
          <button onClick={() => deleteTask(task.id).then(fetchTasks)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
