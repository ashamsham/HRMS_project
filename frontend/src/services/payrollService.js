import api from "../api/axios";

export const payrollService = {
  getAll: () => api.get("/payroll/all"),
  getById: (id) => api.get(`/payroll/${id}`),
  generatePayroll: (data) => api.post("/payroll/generate", data),
  getMyPayslips: () => api.get("/payroll/my-payslips"),
  downloadPayslip: (id) => api.get(`/payroll/payslip/${id}/download`),
  getPayrollReport: () => api.get("/payroll/report"),
  updatePayroll: (id, data) => api.put(`/payroll/update/${id}`, data),
  deletePayroll: (id) => api.delete(`/payroll/delete/${id}`),
};
