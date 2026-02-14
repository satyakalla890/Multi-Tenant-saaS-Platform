import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import TaskModal from "../components/TaskModal";
import "./project.css";
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
    <div className="tasks-page">
      <div className="section-header">
        <div>
          <h2>Tasks</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Manage and track milestones for this project.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setEditingTask(null); setModalOpen(true); }}
        >
          Add New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="glass" style={{ padding: '4rem', textAlign: 'center', marginTop: '2rem', borderRadius: '16px' }}>
          <p style={{ color: 'var(--text-light)', fontStyle: 'normal' }}>No tasks found for this project. Ready to create one?</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((t) => (
            <div key={t.id} className="task-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4>{t.title}</h4>
                <span className={`badge priority-${t.priority || 'medium'}`}>
                  {t.priority}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p>
                  <span>Status</span>
                  <select
                    className="btn btn-outline"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                    value={t.status}
                    onChange={(e) => updateStatus(t.id, e.target.value)}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </p>
                <p>
                  <span>Assigned to</span>
                  <strong style={{ color: 'var(--text-dark)' }}>{t.full_name || "Unassigned"}</strong>
                </p>
              </div>

              <div className="actions" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setEditingTask(t);
                    setModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  style={{ flex: 1 }}
                  onClick={() => handleDelete(t.id)}
                >
                  Delete
                </button>
              </div>
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

