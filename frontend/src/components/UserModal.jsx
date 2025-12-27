import { useState } from "react";
import { addUser, updateUser } from "../services/userService";

export default function UserModal({ tenantId, user, onClose }) {
  const [form, setForm] = useState({
    email: user?.email || "",
    fullName: user?.fullName || "",
    password: "",
    role: user?.role || "user",
    isActive: user?.isActive ?? true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user) {
      await updateUser(user.id, form);
    } else {
      await addUser(tenantId, form);
    }
    onClose();
  };

  return (
    <div className="modal">
      <h3>{user ? "Edit User" : "Add User"}</h3>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        {!user && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        )}

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="tenant_admin">Tenant Admin</option>
        </select>

        <label>
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Active
        </label>

        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}
