import { useEffect, useState } from "react";
import { getTenantUsers, deleteUser } from "../services/userService";
import UserModal from "../components/UserModal";

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
    <div>
      <h2>Users</h2>
      <button onClick={() => setShowModal(true)}>Add User</button>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.full_name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.is_active ? "Active" : "Inactive"}</td>
              <td>{new Date(u.created_at).toLocaleDateString()}</td>
              <td>
                <button onClick={() => { setEditUser(u); setShowModal(true); }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
