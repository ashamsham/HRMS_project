import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const response = await api.get("/task/my-tasks");
        setTasks(response.data || []);
      } catch (err) {
        setError("Unable to load assigned tasks.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  return (
    <div>
      <h1>My Tasks</h1>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    No tasks assigned.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title || "—"}</td>
                    <td>{task.description || "—"}</td>
                    <td>{task.due_date || "—"}</td>
                    <td>{task.priority || "Normal"}</td>
                    <td>{task.status || "Pending"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyTasks;
