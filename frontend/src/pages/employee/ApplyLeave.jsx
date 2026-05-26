import React, { useState, useEffect } from "react";
import api from "../../api/axios";

function ApplyLeave() {
  const [formData, setFormData] = useState({
    employee_id: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: ""
  });
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await api.get("/employee/all");
      setEmployees(response.data || []);
    } catch (err) {
      console.error("Failed to load employees:", err);
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
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/leave/apply", formData);
      setSuccess("Leave request submitted successfully!");
      setFormData({
        employee_id: "",
        leave_type: "",
        start_date: "",
        end_date: "",
        reason: ""
      });
    } catch (err) {
      setError("Failed to submit leave request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Apply for Leave</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
        {error && <p className="error-text">{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label>Employee ID *</label>
          <select
            name="employee_id"
            value={formData.employee_id}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          >
            <option value="">Select Your Employee ID</option>
            {employees.map(emp => (
              <option key={emp.employee_id} value={emp.employee_id}>
                {emp.employee_id} - {emp.full_name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Leave Type *</label>
          <select
            name="leave_type"
            value={formData.leave_type}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          >
            <option value="">Select Leave Type</option>
            <option value="Annual Leave">Annual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Personal Leave">Personal Leave</option>
            <option value="Maternity Leave">Maternity Leave</option>
            <option value="Emergency Leave">Emergency Leave</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Start Date *</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>End Date *</label>
          <input
            type="date"
            name="end_date"
            onChange={handleInputChange}
            value={formData.end_date}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Reason *</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            required
            rows="4"
            placeholder="Please provide a reason for your leave request"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Submitting..." : "Submit Leave Request"}
        </button>
      </form>
    </div>
  );
}

export default ApplyLeave;