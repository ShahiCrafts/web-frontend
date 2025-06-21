import instance from "../api";

const URL = 'admin/announcements';

export const fetchAnnouncements = (params = {}) => {
  return instance.get(`/${URL}`, { params });
};

export const getAnnouncement = (id) => {
  return instance.get(`/${URL}/${id}`);
};

export const createAnnouncement = (announcementData) => {
  return instance.post(`/${URL}`, announcementData);
};

export const updateAnnouncement = (id, updateData) => {
  return instance.put(`/${URL}/${id}`, updateData);
};

export const deleteAnnouncement = (id) => {
  return instance.delete(`/${URL}/${id}`);
};
