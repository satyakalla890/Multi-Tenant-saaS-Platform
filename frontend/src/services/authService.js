import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// REGISTER TENANT
export const registerTenant = (data) => {
  return API.post("/auth/register-tenant", data);
};

// LOGIN
export const login = (data) => {
  return API.post("/auth/login", data);
};

// GET CURRENT USER
export const getMe = () => {
  return API.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
