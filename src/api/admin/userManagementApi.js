import instance from "../api";

export const fetchUsers = (params = {}) => {
  return instance.get("/admin/users", { params });
};

export const deleteUsers = (id) => {
  return instance.delete(`/admin/users/${id}`);
};

