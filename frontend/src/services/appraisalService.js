import api from "../api/axios";

export const appraisalService = {
  getAll: () => api.get("/appraisal/all"),
  getById: (id) => api.get(`/appraisal/${id}`),
  createAppraisal: (data) => api.post("/appraisal/create", data),
  updateAppraisal: (id, data) => api.put(`/appraisal/update/${id}`, data),
  getMyAppraisals: () => api.get("/appraisal/my-appraisals"),
  submitAppraisal: (id, data) => api.put(`/appraisal/submit/${id}`, data),
  deleteAppraisal: (id) => api.delete(`/appraisal/delete/${id}`),
};
