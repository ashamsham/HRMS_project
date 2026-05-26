import React from "react";
import { useNavigate } from "react-router-dom";

const employeeFeatures = [
  { title: "Apply Leave", path: "/dashboard/apply-leave", description: "Submit a new leave request." },
  { title: "View Attendance", path: "/dashboard/attendance", description: "Check your attendance records." },
  { title: "Download Payslips", path: "/dashboard/payslips", description: "Access and download your payslips." },
  { title: "View Notifications", path: "/dashboard/notifications", description: "Check system notifications." },
  { title: "Profile Update", path: "/dashboard/profile", description: "Update your personal information." },
  { title: "Check Leave Balance", path: "/dashboard/leave-status", description: "View your remaining leave days." },
  { title: "Holiday Calendar", path: "/holidays", description: "View company holidays." },
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Employee Dashboard</h1>
      <p>Welcome to your self-service portal. Access your HR functions below.</p>
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

export default Dashboard;