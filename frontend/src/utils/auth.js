import { jwtDecode } from "jwt-decode";

export const saveToken = (token, remember = false) => {
  const storage = remember ? localStorage : sessionStorage;

  storage.setItem("token", token);

  // 🔥 Decode token
  const decoded = jwtDecode(token);

  storage.setItem("userId", decoded.userId);
  storage.setItem("tenantId", decoded.tenantId);
  storage.setItem("role", decoded.role);
};

export const getToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
};
