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

    <div className="modal-overlay">
      <div className="modal">
        <h2>{user ? "Edit Member" : "Add New Member"}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-light)' }}>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="e.g. john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-light)' }}>Full Name</label>
            <input
              name="fullName"
              placeholder="e.g. John Doe"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          {!user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-light)' }}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Set a secure password"
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-light)' }}>Role</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="user">Standard User</option>
                <option value="tenant_admin">Tenant Administrator</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
              <input
                type="checkbox"
                name="isActive"
                style={{ width: 'auto', margin: 0 }}
                checked={form.isActive}
                onChange={handleChange}
              />
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-dark)', cursor: 'pointer' }}>Active Member</label>
            </div>
          </div>

          <div className="modal-actions" style={{ marginTop: '1rem' }}>
            <button className="btn btn-outline" type="button" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" type="submit">
              {user ? "Update Member" : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

