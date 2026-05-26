import api from "./axios";

// Employee APIs
export const employeeAPI = {
  getAll: () => api.get("/employee/all"),
  getById: (id) => api.get(`/employee/${id}`),
  create: (data) => api.post("/employee/add", data),
  update: (id, data) => api.put(`/employee/update/${id}`, data),
  delete: (id) => api.delete(`/employee/delete/${id}`),
  getByDepartment: (dept) => api.get(`/employee/department/${dept}`),
  searchEmployee: (query) => api.get(`/employee/search?q=${query}`),
};

// Attendance APIs
export const attendanceAPI = {
  getAll: () => api.get("/attendance/all"),
  getById: (id) => api.get(`/attendance/${id}`),
  markAttendance: (data) => api.post("/attendance/mark", data),
  getMyAttendance: () => api.get("/attendance/my-records"),
  getAttendanceReport: (params) => api.get("/attendance/report", { params }),
};

// Leave APIs
export const leaveAPI = {
  getAll: () => api.get("/leave/all"),
  getById: (id) => api.get(`/leave/${id}`),
  applyLeave: (data) => api.post("/leave/apply", data),
  getMyLeaves: () => api.get("/leave/my-leaves"),
  approveLeave: (id) => api.put(`/leave/approve/${id}`),
  rejectLeave: (id) => api.put(`/leave/reject/${id}`),
  getLeaveReport: () => api.get("/leave/report"),
};

// Payroll APIs
export const payrollAPI = {
  getAll: () => api.get("/payroll/all"),
  getById: (id) => api.get(`/payroll/${id}`),
  generatePayroll: (data) => api.post("/payroll/generate", data),
  getMyPayslips: () => api.get("/payroll/my-payslips"),
  downloadPayslip: (id) => api.get(`/payroll/payslip/${id}/download`),
  getPayrollReport: () => api.get("/payroll/report"),
};

// Appraisal APIs
export const appraisalAPI = {
  getAll: () => api.get("/appraisal/all"),
  getById: (id) => api.get(`/appraisal/${id}`),
  createAppraisal: (data) => api.post("/appraisal/create", data),
  updateAppraisal: (id, data) => api.put(`/appraisal/update/${id}`, data),
  getMyAppraisals: () => api.get("/appraisal/my-appraisals"),
  submitAppraisal: (id, data) => api.put(`/appraisal/submit/${id}`, data),
};

// Asset APIs
export const assetAPI = {
  getAll: () => api.get("/asset/all"),
  getById: (id) => api.get(`/asset/${id}`),
  allocateAsset: (data) => api.post("/asset/allocate", data),
  deallocateAsset: (id) => api.delete(`/asset/deallocate/${id}`),
  getMyAssets: () => api.get("/asset/my-assets"),
  trackAsset: (id) => api.get(`/asset/track/${id}`),
};

// Task APIs
export const taskAPI = {
  getAll: () => api.get("/task/all"),
  getById: (id) => api.get(`/task/${id}`),
  createTask: (data) => api.post("/task/create", data),
  updateTask: (id, data) => api.put(`/task/update/${id}`, data),
  deleteTask: (id) => api.delete(`/task/delete/${id}`),
  getMyTasks: () => api.get("/task/my-tasks"),
  getTeamTasks: () => api.get("/task/team-tasks"),
  updateTaskStatus: (id, status) => api.put(`/task/${id}/status`, { status }),
};

// Notification APIs
export const notificationAPI = {
  getAll: () => api.get("/notification/all"),
  getUnread: () => api.get("/notification/unread"),
  markAsRead: (id) => api.put(`/notification/${id}/read`),
  deleteNotification: (id) => api.delete(`/notification/${id}`),
};

// Dashboard APIs
export const dashboardAPI = {
  getAdminDashboard: () => api.get("/dashboard/admin"),
  getHRDashboard: () => api.get("/dashboard/hr"),
  getManagerDashboard: () => api.get("/dashboard/manager"),
  getEmployeeDashboard: () => api.get("/dashboard/employee"),
  getStats: () => api.get("/dashboard/stats"),
};

// Holiday APIs
export const holidayAPI = {
  getAll: () => api.get("/holidays/all"),
  getById: (id) => api.get(`/holidays/${id}`),
  createHoliday: (data) => api.post("/holidays/create", data),
  updateHoliday: (id, data) => api.put(`/holidays/update/${id}`, data),
  deleteHoliday: (id) => api.delete(`/holidays/delete/${id}`),
};

// Audit Log APIs
export const auditAPI = {
  getAll: () => api.get("/audit-log/all"),
  getById: (id) => api.get(`/audit-log/${id}`),
  filterLogs: (params) => api.get("/audit-log/filter", { params }),
};

// Test Backend Connection
const BASE_URL = "http://127.0.0.1:8000";

export async function testBackend() {
  try {
    const response = await fetch(`${BASE_URL}/`);

    if (!response.ok) {
      throw new Error("Backend connection failed");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}