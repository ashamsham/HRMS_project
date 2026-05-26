import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function AssignTasks() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: "",
    due_date: "",
    priority: "Normal"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
    loadTasks();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await api.get("/employee/all");
      setEmployees(response.data || []);
    } catch (err) {
      console.error("Failed to load employees", err);
    }
  };

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get("/task/team-tasks");
      setTasks(response.data || []);
    } catch (err) {
      setError("Failed to load assigned tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/task/assign", formData);
      setSuccess("Task assigned successfully.");
      setFormData({ title: "", description: "", assigned_to: "", due_date: "", priority: "Normal" });
      loadTasks();
    } catch (err) {
      setError("Failed to assign task. Please try again.");
    }
  };

  return (
    <div>
      <h1>Assign Tasks</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
        {error && <p className="error-text">{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <div className="form-grid">
          <div>
            <label>Task Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Assign To</label>
            <select
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_id} - {emp.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Due Date</label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
            >
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
            />
          </div>
        </div>
        <button type="submit" style={{ marginTop: "16px" }}>
          Assign Task
        </button>
      </form>

      {loading ? (
        <p>Loading assigned tasks...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    No tasks assigned yet.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title || "—"}</td>
                    <td>{task.assigned_to || "—"}</td>
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

export default AssignTasks;
