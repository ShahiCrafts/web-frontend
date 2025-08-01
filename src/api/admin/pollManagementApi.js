import instance from './../api';

const BASE_URL = 'admin/polls';

export const fetchPolls = (params = {}) => {
  return instance.get(`/${BASE_URL}`, { params });
};

export const getPollById = (pollId) => {
  return instance.get(`/${BASE_URL}/${pollId}`);
};

export const createPoll = (pollData) => {
  return instance.post(`/${BASE_URL}`, pollData);
};

export const updatePoll = (pollId, updateData) => {
  return instance.put(`/${BASE_URL}/${pollId}`, updateData);
};

export const deletePoll = (pollId) => {
  return instance.delete(`/${BASE_URL}/${pollId}`);
};
