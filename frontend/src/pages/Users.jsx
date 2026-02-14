import { useEffect, useState } from "react";
import { getTenantUsers, deleteUser } from "../services/userService";
import UserModal from "../components/UserModal";
import "./project.css";
export default function Users() {
  const tenantId = localStorage.getItem("tenantId");


  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = async () => {
    const res = await getTenantUsers(tenantId);
    setUsers(res.data.data.users);
  };

  useEffect(() => {
    if (!tenantId) {
      console.error("❌ tenantId missing");
      return;
    }
    fetchUsers();
  }, [tenantId]);


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await deleteUser(id);
    fetchUsers();
  };

  return (
    <div className="users-page">
      <div className="section-header">
        <div>
          <h2>User Management</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Manage team members and their access levels.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          Add New User
        </button>
      </div>

      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="user-info">
                    <span className="user-name">{u.full_name}</span>
                    <span className="user-email">{u.email}</span>
                  </div>
                </td>
                <td>
                  <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', textTransform: 'capitalize' }}>
                    {u.role?.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: u.is_active ? '#10b981' : '#cbd5e1'
                    }} />
                    <span style={{ fontSize: '0.875rem' }}>{u.is_active ? "Active" : "Inactive"}</span>
                  </div>
                </td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="btn btn-outline" onClick={() => { setEditUser(u); setShowModal(true); }}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(u.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <UserModal
          tenantId={tenantId}
          user={editUser}
          onClose={() => {
            setShowModal(false);
            setEditUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}

