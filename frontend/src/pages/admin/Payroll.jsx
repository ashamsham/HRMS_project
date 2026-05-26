import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function Payroll() {
  const [payroll, setPayroll] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayroll = async () => {
      try {
        const response = await api.get("/payroll/all");
        setPayroll(response.data || []);
      } catch (err) {
        setError("Failed to load payroll records.");
      } finally {
        setLoading(false);
      }
    };

    loadPayroll();
  }, []);

  return (
    <div>
      <h1>Payroll Management</h1>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading payroll data...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Period</th>
                <th>Base Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Tax</th>
                <th>PF</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payroll.slice(0, 20).map((record, idx) => (
                <tr key={idx}>
                  <td>{record.employee_id || "—"}</td>
                  <td>{record.payroll_month || "—"}</td>
                  <td>${record.basic_salary || "—"}</td>
                  <td>${record.allowances || "—"}</td>
                  <td>${record.deductions || "—"}</td>
                  <td>${record.tax || "—"}</td>
                  <td>${record.pf || "—"}</td>
                  <td>${record.net_salary || "—"}</td>
                  <td>{record.status || "Pending"}</td>
                  <td>{record.generated_date || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Payroll;
