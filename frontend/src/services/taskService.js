import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getProjectTasks = (projectId) =>
  API.get(`/projects/${projectId}/tasks`);

export const createTask = (projectId, data) =>
  API.post(`/projects/${projectId}/tasks`, data);

export const updateTask = (taskId, data) =>
  API.put(`/tasks/${taskId}`, data);

export const updateTaskStatus = (taskId, status) =>
  API.patch(`/tasks/${taskId}/status`, { status });

export const deleteTask = (taskId) =>
  API.delete(`/tasks/${taskId}`);
