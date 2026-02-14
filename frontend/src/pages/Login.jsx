import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { saveToken } from "../utils/auth";
import { jwtDecode } from "jwt-decode";
import "./project.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    subdomain: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({
        email: form.email,
        password: form.password,
        subdomain: form.subdomain,
      });

      const token = res.data.data.token;
      saveToken(token, form.remember);

      const decoded = jwtDecode(token);
      localStorage.setItem("tenantId", decoded.tenantId);
      localStorage.setItem("userId", decoded.userId);
      localStorage.setItem("role", decoded.role);

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <h2>Welcome Back</h2>
          <p>Enter your credentials to access your dashboard</p>
        </header>

        {error && <div className="msg msg-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Tenant Subdomain</label>
            <input
              name="subdomain"
              placeholder="e.g. acme-corp"
              value={form.subdomain}
              onChange={handleChange}
              required
            />
          </div>

          <label className="remember-me">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
            />
            Remember me for 30 days
          </label>

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '0.875rem' }}>
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <footer className="auth-footer">
          Don't have an account?
          <Link to="/register">Create an account</Link>
        </footer>
      </div>
    </div>
  );
}

