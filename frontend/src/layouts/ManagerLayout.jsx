import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function ManagerLayout() {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/manager" },
    { label: "Team Members", path: "/manager/team-members" },
    { label: "Assign Tasks", path: "/manager/assign-tasks" },
    { label: "Attendance", path: "/manager/attendance" },
    { label: "Approvals", path: "/manager/approvals" },
    { label: "Appraisals", path: "/manager/appraisals" },
    { label: "Reports", path: "/manager/reports" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="manager-container">
      <aside className="manager-sidebar">
        <div className="manager-brand">
          <h2>Manager Console</h2>
          <p>Team control</p>
        </div>
        <nav>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="manager-content">
        <Outlet />
      </main>
    </div>
  );
}

export default ManagerLayout;