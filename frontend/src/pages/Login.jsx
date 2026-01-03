import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { saveToken } from "../utils/auth";
import { jwtDecode } from "jwt-decode";


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

      // ✅ Save token
      saveToken(res.data.data.token, form.remember);

      // ✅ Decode JWT (CRITICAL FIX)
      const decoded = jwtDecode(token);

      console.log("DECODED TOKEN:", decoded);

      // ✅ Persist required values
      localStorage.setItem("tenantId", decoded.tenantId);
      localStorage.setItem("userId", decoded.userId);
      localStorage.setItem("role", decoded.role);

      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          name="subdomain"
          placeholder="Tenant Subdomain"
          value={form.subdomain}
          onChange={handleChange}
          required
        />

        <label>
          <input
            type="checkbox"
            name="remember"
            checked={form.remember}
            onChange={handleChange}
          />
          Remember me
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don’t have an account?
        <Link to="/register"> Register</Link>
      </p>
    </div>
  );
}
