import { useState } from "react";
import { registerTenant } from "../services/authService";
import { useNavigate } from "react-router-dom";

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
    if (!form.tenantName || !form.subdomain || !form.adminEmail)
      return "All fields are required";
    if (form.password.length < 8)
      return "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match";
    if (!form.terms)
      return "You must accept Terms & Conditions";
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
        subdomain: form.subdomain,
        adminEmail: form.adminEmail,
        adminPassword: form.password,
        adminFullName: form.adminFullName,
      });

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register Organization</h2>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="tenantName"
          placeholder="Organization Name"
          onChange={handleChange}
        />

        <input
          name="subdomain"
          placeholder="Subdomain"
          onChange={handleChange}
        />
        <small>{form.subdomain}.yourapp.com</small>

        <input
          type="email"
          name="adminEmail"
          placeholder="Admin Email"
          onChange={handleChange}
        />

        <input
          name="adminFullName"
          placeholder="Admin Full Name"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="terms"
            onChange={handleChange}
          />
          Accept Terms & Conditions
        </label>

        <button disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account?
        <span onClick={() => navigate("/login")}> Login</span>
      </p>
    </div>
  );
}
