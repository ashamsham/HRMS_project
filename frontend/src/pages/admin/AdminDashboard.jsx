import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardService } from "../../services/dashboardService";

const adminFeatures = [
  { title: "Employee Management", path: "/admin/employees", description: "Add, update, or remove employee records." },
  { title: "Leave Requests", path: "/admin/leave-reports", description: "Review open leave requests with employee details." },
  { title: "Attendance Reports", path: "/admin/attendance-reports", description: "View daily attendance with check-in/check-out times." },
  { title: "Payroll Entries", path: "/admin/payroll", description: "View all employee salaries by month." },
  { title: "Company Reports", path: "/admin/reports", description: "View monthly HR reports and KPIs." },
  { title: "Notifications", path: "/admin/notifications", description: "View leave requests and system messages." },
  { title: "Audit Logs", path: "/admin/audit-logs", description: "Inspect recent system changes and activity." },
];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data);
      } catch (err) {
        setError("Unable to load dashboard stats.");
      }
    };

    loadStats();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Access core HRMS functions from the sidebar or via the quick action cards below.</p>
      {error && <p className="error-text">{error}</p>}
      {stats ? (
        <div className="grid-summary">
          <div className="summary-card">
            <h3>Total Employees</h3>
            <p>{stats.total_employees ?? "—"}</p>
          </div>
          <div className="summary-card">
            <h3>Open Leave Requests</h3>
            <p>{stats.open_leaves ?? "—"}</p>
          </div>
          <div className="summary-card">
            <h3>Pending Attendance</h3>
            <p>{stats.pending_attendance ?? "—"}</p>
          </div>
          <div className="summary-card">
            <h3>Payroll Entries</h3>
            <p>{stats.payroll_entries ?? "—"}</p>
          </div>
        </div>
      ) : (
        <p>Loading statistics...</p>
      )}
      <div className="feature-grid" style={{ marginTop: "32px" }}>
        {adminFeatures.map((item) => (
          <button
            key={item.path}
            className="feature-card"
            onClick={() => navigate(item.path)}
            type="button"
          >
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;

