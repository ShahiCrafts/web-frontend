import instance from "../api";

export const fetchUsers = (params = {}) => {
  return instance.get("/admin/users", { params });
};

export const deleteUsers = (id) => {
  return instance.delete(`/admin/users/${id}`);
};

export const getUserEngagementAnalytics = () => {
  return instance.get(`/admin/users/engagement`);
};

export const toggleUserBanStatus = (id) => {
  return instance.patch(`/admin/users/toggle-ban/${id}`);
};

