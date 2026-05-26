import api from "../api/axios";

export const taskService = {
  getAll: () => api.get("/task/all"),
  getById: (id) => api.get(`/task/${id}`),
  createTask: (data) => api.post("/task/create", data),
  updateTask: (id, data) => api.put(`/task/update/${id}`, data),
  deleteTask: (id) => api.delete(`/task/delete/${id}`),
  getMyTasks: () => api.get("/task/my-tasks"),
  getTeamTasks: () => api.get("/task/team-tasks"),
  updateTaskStatus: (id, status) => api.put(`/task/${id}/status`, { status }),
};
