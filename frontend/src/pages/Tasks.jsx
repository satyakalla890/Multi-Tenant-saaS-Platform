import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import TaskModal from "../components/TaskModal";

export default function Tasks() {
  const { projectId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  console.log("PROJECT ID:", projectId);

  // 🔹 Fetch tasks
  const fetchTasks = async () => {
    if (!projectId) return;

    const res = await API.get(`/projects/${projectId}/tasks`);
    const result = res.data.data;

    setTasks(Array.isArray(result) ? result : result.tasks || []);
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  // 🔹 Create OR Update task
  const handleSave = async (taskData) => {
    if (editingTask) {
      // ✅ UPDATE TASK (PUT)
      await API.put(`/tasks/${editingTask.id}`, taskData);
    } else {
      // ✅ CREATE TASK
      await API.post(`/projects/${projectId}/tasks`, taskData);
    }

    setModalOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  // 🔹 Delete task
  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete task?")) return;
    await API.delete(`/tasks/${taskId}`);
    fetchTasks();
  };

  // 🔹 Update status (PATCH)
  const updateStatus = async (taskId, status) => {
    await API.patch(`/tasks/${taskId}/status`, { status });
    fetchTasks();
  };

  return (
    <div>
      <h2>Tasks</h2>

      <button onClick={() => { setEditingTask(null); setModalOpen(true); }}>
        Add Task
      </button>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="tasks-grid">
          {tasks.map((t) => (
            <div key={t.id} className="task-card">
              <h4>{t.title}</h4>

              <p>
                Status:
                <select
                  value={t.status}
                  onChange={(e) => updateStatus(t.id, e.target.value)}
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </p>

              <p>Priority: {t.priority}</p>
              <p>Assigned: {t.full_name || "Unassigned"}</p>

              <button
                onClick={() => {
                  setEditingTask(t);
                  setModalOpen(true);
                }}
              >
                Edit
              </button>

              <button onClick={() => handleDelete(t.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      <TaskModal
        show={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSave}
        task={editingTask}
      />
    </div>
  );
}
