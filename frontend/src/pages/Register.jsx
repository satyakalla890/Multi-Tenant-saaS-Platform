import { useState } from "react";
import { registerTenant } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import "./project.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tenantName: "",
    subdomain: "",
    adminEmail: "",
    adminFullName: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const validate = () => {
    if (!form.tenantName || !form.subdomain || !form.adminEmail || !form.adminFullName)
      return "All fields are required";
    if (form.password.length < 8)
      return "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match";
    if (!form.terms)
      return "You must accept the Terms & Conditions";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await registerTenant({
        tenantName: form.tenantName,
        subdomain: form.subdomain.toLowerCase().trim(),
        adminEmail: form.adminEmail,
        adminPassword: form.password,
        adminFullName: form.adminFullName,
      });

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try a different subdomain.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <header className="auth-header">
          <h2>Create Organization</h2>
          <p>Launch your multi-tenant platform in minutes</p>
        </header>

        {error && <div className="msg msg-error">{error}</div>}
        {success && <div className="msg msg-success">{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Organization Name</label>
              <input
                name="tenantName"
                placeholder="e.g. Acme Corp"
                value={form.tenantName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Subdomain</label>
              <input
                name="subdomain"
                placeholder="e.g. acme"
                value={form.subdomain}
                onChange={handleChange}
                required
              />
              <small style={{ color: 'var(--text-light)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {form.subdomain || 'company'}.saas-platform.com
              </small>
            </div>
          </div>

          <div className="form-group">
            <label>Admin Full Name</label>
            <input
              name="adminFullName"
              placeholder="e.g. Jane Smith"
              value={form.adminFullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              name="adminEmail"
              placeholder="e.g. admin@acme.com"
              value={form.adminEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label className="remember-me">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              required
            />
            I agree to the Terms & Privacy Policy
          </label>

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '0.875rem' }}>
            {loading ? "Creating Account..." : "Register Now"}
          </button>
        </form>

        <footer className="auth-footer">
          Already have an account?
          <Link to="/login">Sign In</Link>
        </footer>
      </div>
    </div>
  );
}

