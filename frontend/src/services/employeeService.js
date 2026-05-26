import api from "../api/axios";

export const employeeService = {
  getAllEmployees: (skip = 0, limit = 100) =>
    api.get(`/employee/all?skip=${skip}&limit=${limit}`),

  addEmployee: (data) => api.post("/employee/add", data),

  updateEmployee: (employeeId, data) =>
    api.put(`/employee/update/${employeeId}`, data),

  deleteEmployee: (employeeId) => api.delete(`/employee/delete/${employeeId}`),
};
