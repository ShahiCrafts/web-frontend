// src/api/user/profileApi.js
import instance from '../api';

const URL = 'users'; // adjust this prefix if your backend uses a different base path

export const fetchUserProfile = (userId) => {
  return instance.get(`/${URL}/${userId}`);
};

export const updateUserProfile = (userId, updateData) => {
  return instance.put(`/${URL}/${userId}`, updateData);
};

// Add the missing export for deleteUserProfile
export const deleteUserProfile = (userId) => {
  return instance.delete(`/${URL}/${userId}`);
};

export const changeUserPassword = (userId, passwordData) => {
  // passwordData = { currentPassword, newPassword }
  return instance.put(`/${URL}/${userId}/change-password`, passwordData);
};

export const fetchUserPosts = (userId, params = {}) => {
  // params can include pagination, filters, etc.
  return instance.get(`/${URL}/${userId}/posts`, { params });
};

export const fetchUserAchievements = (userId) => {
  return instance.get(`/${URL}/${userId}/achievements`);
};

export const fetchUserActiveSessions = (userId) => {
  // your router uses /:id/sessions to get active sessions
  return instance.get(`/${URL}/${userId}/sessions`);
};

export const logoutUserFromAllDevices = (userId) => {
  // your route uses POST for logout-all
  return instance.post(`/${URL}/${userId}/logout-all`);
};

export const revokeUserSession = (userId, sessionId) => {
  return instance.put(`/${URL}/${userId}/sessions/${sessionId}/revoke`);
};