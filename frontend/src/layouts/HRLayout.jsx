import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function HRLayout() {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/hr" },
    { label: "Employees", path: "/hr/employees" },
    { label: "Attendance", path: "/hr/attendance" },
    { label: "Leave Requests", path: "/hr/leave-requests" },
    { label: "Payroll", path: "/hr/payroll" },
    { label: "Holiday Calendar", path: "/hr/holiday-calendar" },
    { label: "Notifications", path: "/hr/notifications" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="hr-container">
      <aside className="hr-sidebar">
        <div className="hr-brand">
          <h2>HR Console</h2>
          <p>Employee operations</p>
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
      <main className="hr-content">
        <Outlet />
      </main>
    </div>
  );
}

export default HRLayout;