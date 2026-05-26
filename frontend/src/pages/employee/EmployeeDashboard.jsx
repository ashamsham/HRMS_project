import React from "react";
import { useNavigate } from "react-router-dom";

const employeeFeatures = [
  { title: "My Attendance", path: "/employee/attendance", description: "View your daily attendance records." },
  { title: "Apply Leave", path: "/employee/apply-leave", description: "Submit leave requests with details." },
  { title: "Leave Status", path: "/employee/leave-status", description: "Check approval status of your leave requests." },
  { title: "My Profile", path: "/employee/profile", description: "View and update your personal information." },
  { title: "Notifications", path: "/employee/notifications", description: "View messages and leave approvals." },
  { title: "Payroll History", path: "/employee/payroll", description: "View your salary slips and payment history." },
];

function EmployeeDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Employee Dashboard</h1>
      <p>Access your personal HR information and services.</p>
      <div className="feature-grid" style={{ marginTop: "32px" }}>
        {employeeFeatures.map((item) => (
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

export default EmployeeDashboard;