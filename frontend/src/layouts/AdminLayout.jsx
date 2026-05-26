import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/admin" },
    { label: "Users", path: "/admin/users" },
    { label: "Employees", path: "/admin/employees" },
    { label: "Departments", path: "/admin/departments" },
    { label: "Company Reports", path: "/admin/reports" },
    { label: "Attendance Reports", path: "/admin/attendance-reports" },
    { label: "Leave Reports", path: "/admin/leave-reports" },
    { label: "Payroll", path: "/admin/payroll" },
    { label: "Audit Logs", path: "/admin/audit-logs" },
    { label: "Settings", path: "/admin/settings" },
    { label: "Notifications", path: "/admin/notifications" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>Admin Console</h2>
          <p>Full system control</p>
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
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
