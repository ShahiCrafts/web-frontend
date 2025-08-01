import instance from '../api';

const URL = 'posts';

export const fetchPosts = (params = {}) => {
  return instance.get(`/${URL}/fetch/all`, { params });
};

export const fetchPopularPosts = (page = 1, limit = 10) => {
  return instance.get(`/posts/fetch/popular?page=${page}&limit=${limit}`);
};

export const getPost = (id) => {
  return instance.get(`/${URL}/fetch/${id}`);
};

export const createPost = (postData) => {
  return instance.post(`/${URL}/create`, postData);
};

export const updatePost = (id, updateData) => {
  return instance.put(`/${URL}/update/${id}`, updateData);
};

export const deletePost = (id) => {
  return instance.delete(`/${URL}/delete/${id}`);
};

export const reportPost = (id, reason, type) => {
  return instance.post(`/${URL}/${id}/report`, { reason, type });
};

export const likePost = (postId) => {
  return instance.post(`/${URL}/${postId}/like`);
};

export const dislikePost = (postId) => {
  return instance.post(`/${URL}/${postId}/dislike`);
};

export const toggleEventInterest = (eventId) => {
  return instance.post(`/${URL}/${eventId}/interest`);
};

export const toggleEventRSVP = (eventId) => {
  return instance.post(`/${URL}/${eventId}/rsvp`);
};

export const castVote = (postId, optionIndex) => {
  return instance.post(`/${URL}/${postId}/vote`, { optionIndex });
};