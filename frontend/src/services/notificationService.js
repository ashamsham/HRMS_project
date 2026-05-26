import api from "../api/axios";

export const notificationService = {
  getAll: () => api.get("/notification/all"),
  getUnread: () => api.get("/notification/unread"),
  markAsRead: (id) => api.put(`/notification/${id}/read`),
  deleteNotification: (id) => api.delete(`/notification/${id}`),
  getNotificationStats: () => api.get("/notification/stats"),
};
