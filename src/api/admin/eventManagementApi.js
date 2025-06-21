import instance from "../api";

const URL = 'admin/events';

export const fetchEvents = (params = {}) => {
  return instance.get(`/${URL}`, { params });
};

export const getEvent = (id) => {
  return instance.get(`/${URL}/${id}`);
};

export const createEvent = (eventData) => {
  return instance.post(`/${URL}`, eventData);
};

export const updateEvent = (id, updateData) => {
  return instance.put(`/${URL}/${id}`, updateData);
};

export const deleteEvent = (id) => {
  return instance.delete(`/${URL}/${id}`);
};
