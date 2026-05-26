import React from "react";
import { useNavigate } from "react-router-dom";

const managerFeatures = [
  { title: "Assign Tasks", path: "/manager/assign-tasks", description: "Delegate tasks to team members." },
  { title: "Track Employee Work", path: "/manager/team-members", description: "Monitor progress and performance." },
  { title: "Team Attendance", path: "/manager/attendance", description: "Review team attendance records." },
  { title: "Team Leave Approvals", path: "/manager/approvals", description: "Approve or deny leave requests." },
  { title: "Performance Review", path: "/manager/appraisals", description: "Conduct performance evaluations." },
  { title: "Appraisal Comments", path: "/manager/appraisals", description: "Provide feedback and comments." },
  { title: "Team Reports", path: "/manager/reports", description: "Generate team performance reports." },
];

function ManagerDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Manager Dashboard</h1>
      <p>Control team activities and oversee operations.</p>
      <div className="feature-grid" style={{ marginTop: "32px" }}>
        {managerFeatures.map((item) => (
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

export default ManagerDashboard;