import instance from './../api';

const BASE_URL = 'admin/discussions';

export const fetchDiscussions = (params = {}) => {
  return instance.get(`/${BASE_URL}`, { params });
};

export const togglePinStatus = (discussionId) => {
  return instance.patch(`/${BASE_URL}/toggle-pin/${discussionId}`);
};

export const getDiscussionById = (discussionId) => {
  return instance.get(`/${BASE_URL}/${discussionId}`);
};

export const fetchModerationDiscussions = (params = {}) => {
  return instance.get(`/${BASE_URL}/moderation-queue`, { params });
};