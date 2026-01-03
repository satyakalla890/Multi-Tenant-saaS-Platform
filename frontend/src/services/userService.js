import API from "./api";

// ✅ USE THE SAME AXIOS INSTANCE WITH TOKEN

export const getTenantUsers = (tenantId, params = {}) =>
  API.get(`/tenants/${tenantId}/users`, { params });

export const addUser = (tenantId, data) =>
  API.post(`/tenants/${tenantId}/users`, data);

export const updateUser = (userId, data) =>
  API.put(`/users/${userId}`, data);

export const deleteUser = (userId) =>
  API.delete(`/users/${userId}`);
