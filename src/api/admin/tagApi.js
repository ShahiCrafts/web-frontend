import instance from "../api";

const URL = 'admin/tags';

export const fetchTags = (params = {}) => {
  return instance.get(`${URL}/fetch/all`, { params });
};

export const getTag = (id) => {
  return instance.get(`${URL}/fetch/${id}`);
};

export const createTag = (tagData) => {
  return instance.post(`/${URL}/create`, tagData);
};

export const updateTag = (id, updateData) => {
  return instance.put(`/${URL}/${id}`, updateData);
};

export const deleteTag = (id) => {
  return instance.delete(`/${URL}/${id}`);
};
