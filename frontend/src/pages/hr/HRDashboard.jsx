import React from "react";
import { useNavigate } from "react-router-dom";

const hrFeatures = [
  { title: "Employee Management", path: "/hr/employees", description: "Add, update, or remove employee records." },
  { title: "Payroll Management", path: "/hr/payroll-management", description: "Manually enter and manage employee salaries." },
  { title: "Holiday Calendar", path: "/hr/holiday-calendar", description: "Manage company holidays for the current year." },
  { title: "Leave Requests", path: "/hr/leave-requests", description: "Review and approve leave applications." },
  { title: "Attendance Reports", path: "/hr/attendance-reports", description: "Track and manage attendance records." },
  { title: "Notifications", path: "/hr/notifications", description: "Send and receive messages across the organization." },
  { title: "Audit Logs", path: "/hr/audit-logs", description: "Inspect recent system changes and activity." },
];

function HRDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>HR Dashboard</h1>
      <p>Manage employee operations and HR functions.</p>
      <div className="feature-grid" style={{ marginTop: "32px" }}>
        {hrFeatures.map((item) => (
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

export default HRDashboard;
