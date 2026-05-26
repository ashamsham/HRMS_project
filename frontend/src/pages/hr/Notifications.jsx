import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    recipient_role: "",
    message: "",
    title: ""
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await api.get("/notification/my-notifications");
      setNotifications(response.data || []);
    } catch (err) {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/notification/create", formData);
      setShowForm(false);
      setFormData({
        recipient_role: "",
        message: "",
        title: ""
      });
      loadNotifications();
    } catch (err) {
      setError("Failed to send notification.");
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/notification/mark-read/${notificationId}`);
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read");
    }
  };

  return (
    <div>
      <h1>HR Notifications</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: "20px", padding: "10px 20px" }}
      >
        {showForm ? "Cancel" : "Send Notification"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ccc" }}>
          <h3>Send Notification</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
            <div>
              <label>Recipient Role *</label>
              <select
                name="recipient_role"
                value={formData.recipient_role}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Role</option>
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="all">All</option>
              </select>
            </div>
            <div>
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                required
              />
            </div>
          </div>
          <button type="submit" style={{ marginTop: "10px" }}>Send Notification</button>
        </form>
      )}

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading notifications...</p>
      ) : (
        <div>
          {notifications.length === 0 ? (
            <p>No notifications yet.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Message</th>
                    <th>Sent By</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification, idx) => (
                    <tr key={idx}>
                      <td>{notification.title || "—"}</td>
                      <td>{notification.message || "—"}</td>
                      <td>{notification.sender_name || "—"}</td>
                      <td>{notification.created_at ? new Date(notification.created_at).toLocaleDateString() : "—"}</td>
                      <td>
                        {!notification.is_read && (
                          <button onClick={() => handleMarkAsRead(notification.id)}>
                            Mark as Read
                          </button>
                        )}
                        {notification.is_read ? "Read" : "Unread"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;