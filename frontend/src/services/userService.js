import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getTenantUsers = (tenantId, params = {}) =>
  API.get(`/tenants/${tenantId}/users`, { params });

export const addUser = (tenantId, data) =>
  API.post(`/tenants/${tenantId}/users`, data);

export const updateUser = (userId, data) =>
  API.put(`/users/${userId}`, data);

export const deleteUser = (userId) =>
  API.delete(`/users/${userId}`);
