import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function EmployeeProfile() {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Assuming there's an endpoint to get current user profile
        // For now, use /employee/all and find current user, but better to have /employee/me
        const response = await api.get("/employee/all");
        // In real app, get current user ID from token or API
        // For demo, assume first employee or something
        setEmployee(response.data[0] || null);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!employee) return <p>No profile data available.</p>;

  return (
    <div>
      <h1>My Profile</h1>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ marginBottom: "15px" }}>
          <label>Employee ID:</label>
          <p>{employee.employee_id}</p>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Full Name:</label>
          <p>{employee.full_name}</p>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label>
          <p>{employee.email}</p>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Department:</label>
          <p>{employee.department}</p>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Designation:</label>
          <p>{employee.designation}</p>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Joining Date:</label>
          <p>{employee.joining_date}</p>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Contact Number:</label>
          <p>{employee.contact_number}</p>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Reporting Manager:</label>
          <p>{employee.reporting_manager}</p>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;