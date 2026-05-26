import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protectedroute";
import Login from "../pages/login";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/dashboard";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import EmployeeManagement from "../pages/admin/EmployeeManagement";
import Departments from "../pages/admin/Departments";
import AttendanceReports from "../pages/admin/AttendanceReports";
import LeaveReports from "../pages/admin/LeaveReports";
import Payroll from "../pages/admin/Payroll";
import AuditLogs from "../pages/admin/AuditLogs";
import Reports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings";
import AdminNotifications from "../pages/admin/Notifications";
import HRLayout from "../layouts/HRLayout";
import HRDashboard from "../pages/hr/HRDashboard";
import PayrollManagement from "../pages/hr/PayrollManagement";
import HolidayCalendar from "../pages/hr/HolidayCalendar";
import HRNotifications from "../pages/hr/Notifications";
import ManagerLayout from "../layouts/ManagerLayout";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import AssignTasks from "../pages/manager/AssignTasks";
import EmployeeLayout from "../layouts/EmployeeLayout";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import Attendance from "../pages/employee/Attendance";
import ApplyLeave from "../pages/employee/ApplyLeave";
import LeaveStatus from "../pages/employee/LeaveStatus";
import MyPayroll from "../pages/employee/MyPayroll";
import MyTasks from "../pages/employee/MyTasks";
import EmployeeProfile from "../pages/employee/EmployeeProfile";
import Notifications from "../pages/employee/Notifications";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployeeDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="apply-leave" element={<ApplyLeave />} />
          <Route path="leave-status" element={<LeaveStatus />} />
          <Route path="tasks" element={<MyTasks />} />
          <Route path="payslips" element={<MyPayroll />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<EmployeeProfile />} />
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="employees" element={<EmployeeManagement />} />
          <Route path="departments" element={<Departments />} />
          <Route path="attendance-reports" element={<AttendanceReports />} />
          <Route path="leave-reports" element={<LeaveReports />} />
          <Route path="reports" element={<Reports />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<AdminNotifications />} />
        </Route>
        <Route
          path="/hr"
          element={
            <ProtectedRoute requiredRole="HR">
              <HRLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HRDashboard />} />
          <Route path="employees" element={<EmployeeManagement />} />
          <Route path="attendance-reports" element={<AttendanceReports />} />
          <Route path="leave-requests" element={<LeaveReports />} />
          <Route path="payroll-management" element={<PayrollManagement />} />
          <Route path="holiday-calendar" element={<HolidayCalendar />} />
          <Route path="notifications" element={<HRNotifications />} />
        </Route>
        <Route
          path="/manager"
          element={
            <ProtectedRoute requiredRole="Manager">
              <ManagerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ManagerDashboard />} />
          <Route path="team-members" element={<EmployeeManagement />} />
          <Route path="assign-tasks" element={<AssignTasks />} />
          <Route path="attendance" element={<AttendanceReports />} />
          <Route path="approvals" element={<LeaveReports />} />
          <Route path="appraisals" element={<Reports />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;