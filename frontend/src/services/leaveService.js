import api from "../api/axios";

export const leaveService = {
  getAll: () => api.get("/leave/all"),
  getById: (id) => api.get(`/leave/${id}`),
  applyLeave: (data) => api.post("/leave/apply", data),
  getMyLeaves: () => api.get("/leave/my-leaves"),
  approveLeave: (id) => api.put(`/leave/approve/${id}`),
  rejectLeave: (id) => api.put(`/leave/reject/${id}`),
  getLeaveReport: () => api.get("/leave/report"),
  updateLeave: (id, data) => api.put(`/leave/update/${id}`, data),
  deleteLeave: (id) => api.delete(`/leave/delete/${id}`),
};
