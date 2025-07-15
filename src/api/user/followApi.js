// src/api/followApi.js
import instance from '../api';

const URL = 'follows';

export const followUser = (userId) => {
  return instance.post(`/${URL}/${userId}`);
};

export const unfollowUser = (userId) => {
  return instance.delete(`/${URL}/${userId}`);
};

export const checkFollowingStatus = (userId) => {
  return instance.get(`/${URL}/check/${userId}`);
};

// Fetch users the target user is following
export const getFollowing = (userId, params = {}) => {
  return instance.get(`/users/${userId}/following`, { params });
};

// Fetch users who follow the target user
export const getFollowers = (userId, params = {}) => {
  return instance.get(`/users/${userId}/followers`, { params });
};
