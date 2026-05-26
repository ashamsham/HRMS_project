import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        const [statsResponse, payrollResponse] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/payroll-summary")
        ]);

        setReport({
          ...statsResponse.data,
          ...payrollResponse.data
        });
      } catch (err) {
        setError("Failed to load company reports.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  const attendanceRate = report?.total_employees
    ? ((report.today_attendance / report.total_employees) * 100).toFixed(1)
    : "0";

  return (
    <div>
      <h1>Company Reports</h1>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading report summary...</p>
      ) : (
        <div className="report-summary">
          <div className="summary-card">
            <h3>Total Employees</h3>
            <p>{report?.total_employees ?? "—"}</p>
          </div>
          <div className="summary-card">
            <h3>Open Leave Requests</h3>
            <p>{report?.pending_leaves ?? "—"}</p>
          </div>
          <div className="summary-card">
            <h3>Attendance Rate</h3>
            <p>{attendanceRate}%</p>
          </div>
          <div className="summary-card">
            <h3>Payroll Entries</h3>
            <p>{report?.total_payrolls ?? "—"}</p>
          </div>
          <div className="summary-card">
            <h3>Total Salary Paid</h3>
            <p>${report?.total_paid_salary?.toFixed(2) ?? "0.00"}</p>
          </div>
          <div className="summary-card">
            <h3>Pending Salary</h3>
            <p>${report?.pending_salary?.toFixed(2) ?? "0.00"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
