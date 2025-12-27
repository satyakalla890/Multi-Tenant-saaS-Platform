import axios from "axios";
import { getToken, logout } from "../utils/auth";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      logout();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
// Projects
export const getProjects = (params = {}) => API.get("/projects", { params });
export const createProject = (data) => API.post("/projects", data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

export default API;
