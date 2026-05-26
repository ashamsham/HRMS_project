import api from "../api/axios";

export const holidayService = {
  getAll: () => api.get("/holidays/all"),
  getById: (id) => api.get(`/holidays/${id}`),
  createHoliday: (data) => api.post("/holidays/create", data),
  updateHoliday: (id, data) => api.put(`/holidays/update/${id}`, data),
  deleteHoliday: (id) => api.delete(`/holidays/delete/${id}`),
};
