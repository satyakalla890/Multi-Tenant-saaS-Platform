import { useNavigate, Link } from "react-router-dom";
import { logout } from "../utils/auth";

export default function Navbar({ currentUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">Dashboard</div>


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
        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
          {currentUser.fullName}
          <span style={{ color: 'var(--text-light)', fontWeight: 400, marginLeft: '0.5rem' }}>
            ({currentUser.role?.replace('_', ' ')})
          </span>
        </span>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

