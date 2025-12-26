import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Export functions
export const registerTenant = (data) =>
  API.post("/auth/register-tenant", data);

export const login = (data) =>
  API.post("/auth/login", data); // <-- this must be named "login"
