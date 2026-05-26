import api from "../api/axios";

export const attendanceService = {
  getAll: () => api.get("/attendance/all"),
  getById: (id) => api.get(`/attendance/${id}`),
  markAttendance: (data) => api.post("/attendance/mark", data),
  getMyAttendance: () => api.get("/attendance/my-records"),
  getAttendanceReport: (params) => api.get("/attendance/report", { params }),
  updateAttendance: (id, data) => api.put(`/attendance/update/${id}`, data),
  deleteAttendance: (id) => api.delete(`/attendance/delete/${id}`),
};
