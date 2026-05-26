import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDepartments = async () => {
      setLoading(true);
      try {
        const response = await api.get("/dashboard/departments");
        setDepartments(response.data || []);
      } catch (err) {
        setError("Failed to load department headcount.");
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  return (
    <div>
      <h1>Departments</h1>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading department counts...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Total Employees</th>
              </tr>
            </thead>
            <tbody>
              {departments.length === 0 ? (
                <tr>
                  <td colSpan="2">No departments available.</td>
                </tr>
              ) : (
                departments.map((dept, idx) => (
                  <tr key={idx}>
                    <td>{dept.department || "Unassigned"}</td>
                    <td>{dept.employee_count ?? 0}</td>
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

export default Departments;
