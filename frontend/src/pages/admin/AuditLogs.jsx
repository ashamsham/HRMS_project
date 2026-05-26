import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const response = await api.get("/audit-log/all");
        setLogs(response.data || []);
      } catch (err) {
        setError("Failed to load audit logs.");
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  return (
    <div>
      <h1>Audit Logs</h1>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading audit logs...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Action</th>
                <th>Module</th>
                <th>Timestamp</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 50).map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.user_id || "—"}</td>
                  <td>{log.action || "—"}</td>
                  <td>{log.module || "—"}</td>
                  <td>{log.timestamp || "—"}</td>
                  <td>{log.details || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AuditLogs;
