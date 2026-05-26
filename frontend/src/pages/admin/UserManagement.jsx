import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.get("/auth/users");
        setUsers(response.data || []);
      } catch (err) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/auth/delete-user/${userId}`);
        setUsers(users.filter((u) => u.id !== userId));
      } catch (err) {
        setError("Failed to delete user.");
      }
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.role || "User"}</td>
                  <td>Active</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-small btn-delete"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
