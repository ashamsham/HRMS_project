import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function EmployeeLayout() {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Attendance", path: "/dashboard/attendance" },
    { label: "Apply Leave", path: "/dashboard/apply-leave" },
    { label: "Leave Status", path: "/dashboard/leave-status" },
    { label: "My Tasks", path: "/dashboard/tasks" },
    { label: "Payslips", path: "/dashboard/payslips" },
    { label: "Notifications", path: "/dashboard/notifications" },
    { label: "Profile", path: "/dashboard/profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="employee-container">
      <aside className="employee-sidebar">
        <div className="employee-brand">
          <h2>Employee Portal</h2>
          <p>Self-service dashboard</p>
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
      <main className="employee-content">
        <Outlet />
      </main>
    </div>
  );
}

export default EmployeeLayout;