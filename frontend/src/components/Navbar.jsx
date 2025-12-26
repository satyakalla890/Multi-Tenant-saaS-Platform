import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function Navbar({ currentUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">My SaaS App</div>
      <ul className="menu">
        <li onClick={() => navigate("/dashboard")}>Dashboard</li>
        <li onClick={() => navigate("/projects")}>Projects</li>
        {["tenant_admin", "super_admin"].includes(currentUser.role) && (
          <li onClick={() => navigate("/tasks")}>Tasks</li>
        )}
        {currentUser.role === "tenant_admin" && (
          <li onClick={() => navigate("/users")}>Users</li>
        )}
        {currentUser.role === "super_admin" && (
          <li onClick={() => navigate("/tenants")}>Tenants</li>
        )}
      </ul>
      <div className="user-dropdown">
        {currentUser.fullName} ({currentUser.role})
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
