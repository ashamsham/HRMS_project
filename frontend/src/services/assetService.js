import api from "../api/axios";

export const assetService = {
  getAll: () => api.get("/asset/all"),
  getById: (id) => api.get(`/asset/${id}`),
  allocateAsset: (data) => api.post("/asset/allocate", data),
  deallocateAsset: (id) => api.delete(`/asset/deallocate/${id}`),
  getMyAssets: () => api.get("/asset/my-assets"),
  trackAsset: (id) => api.get(`/asset/track/${id}`),
  updateAsset: (id, data) => api.put(`/asset/update/${id}`, data),
};
