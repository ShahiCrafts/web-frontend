import instance from "../api";

const URL = 'admin/categories';

export const fetchCategories = (params = {}) => {
  return instance.get(`/${URL}/fetch/all`, { params });
};

export const getCategory = (id) => {
  return instance.get(`/${URL}/${id}`);
};

export const createCategory = (categoryData) => {
  return instance.post(`/${URL}/create`, categoryData);
};

export const updateCategory = (id, updateData) => {
  return instance.put(`/${URL}/${id}`, updateData);
};

export const deleteCategory = (id) => {
  return instance.delete(`/${URL}/${id}`);
};
