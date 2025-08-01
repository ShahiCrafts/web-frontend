import instance from './../api';

const BASE_URL = 'admin/events';

export const fetchEvents = (params = {}) => {
  return instance.get(`/${BASE_URL}`, { params });
};

export const getEventById = (eventId) => {
  return instance.get(`/${BASE_URL}/${eventId}`);
};

export const createEvent = (eventData) => {
  return instance.post(`/${BASE_URL}`, eventData);
};

export const updateEvent = (eventId, updateData) => {
  return instance.put(`/${BASE_URL}/${eventId}`, updateData);
};

export const deleteEvent = (eventId) => {
  return instance.delete(`/${BASE_URL}/${eventId}`);
};
