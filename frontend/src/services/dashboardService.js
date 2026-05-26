import api from "../api/axios";

export const dashboardService = {
  getStats: () => api.get("/dashboard/stats"),
  getAppraisalReport: (employeeId) =>
    api.get(`/dashboard/appraisal-report/${employeeId}`),
};
