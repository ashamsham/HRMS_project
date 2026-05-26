import api from "../api/axios";

export const auditService = {
  getAll: () => api.get("/audit-log/all"),
  getById: (id) => api.get(`/audit-log/${id}`),
  filterLogs: (params) => api.get("/audit-log/filter", { params }),
  getUserLogs: (userId) => api.get(`/audit-log/user/${userId}`),
};
