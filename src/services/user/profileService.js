import {
  fetchUserProfile,
  updateUserProfile,
  deleteUserProfile,
  changeUserPassword,
  fetchUserPosts,
  fetchUserAchievements,
  fetchUserActiveSessions,
  logoutUserFromAllDevices,
  revokeUserSession,
} from '../../api/user/profileApi';

const fetchUserProfileService = async (userId) => {
  try {
    const response = await fetchUserProfile(userId);
    return response.data;
  } catch (err) {
    console.error('fetchUserProfileService error:', err.response || err);
    throw err.response?.data || { message: 'Failed to fetch user profile.' };
  }
};

const updateUserProfileService = async (userId, updateData) => {
  try {
    const response = await updateUserProfile(userId, updateData);
    return response.data;
  } catch (err) {
    console.error('updateUserProfileService error:', err.response || err);
    throw err.response?.data || { message: 'Failed to update user profile.' };
  }
};

const deleteUserProfileService = async (userId) => {
  try {
    const response = await deleteUserProfile(userId);
    return response.data;
  } catch (err) {
    console.error('deleteUserProfileService error:', err.response || err);
    throw err.response?.data || { message: 'Failed to delete user profile.' };
  }
};

const changeUserPasswordService = async (userId, passwordData) => {
  try {
    const response = await changeUserPassword(userId, passwordData);
    return response.data;
  } catch (err) {
    console.error('changeUserPasswordService error:', err.response || err);
    throw err.response?.data || { message: 'Failed to change user password.' };
  }
};

const fetchUserPostsService = async (userId, params = {}) => {
  try {
    const response = await fetchUserPosts(userId, params);
    return response.data;
  } catch (err) {
    console.error('fetchUserPostsService error:', err.response || err);
    throw err.response?.data || { message: 'Failed to fetch user posts.' };
  }
};

const fetchUserAchievementsService = async (userId) => {
  try {
    const response = await fetchUserAchievements(userId);
    return response.data;
  } catch (err) {
    console.error('fetchUserAchievementsService error:', err.response || err);
    throw err.response?.data || { message: 'Failed to fetch user achievements.' };
  }
};

const fetchUserActiveSessionsService = async (userId) => {
  try {
    const response = await fetchUserActiveSessions(userId);
    return response.data;
  } catch (err) {
    console.error('fetchUserActiveSessionsService error:', err.response || err);
    throw err.response?.data || { message: 'Failed to fetch active sessions.' };
  }
};

const logoutUserFromAllDevicesService = async (userId) => {
  try {
    const response = await logoutUserFromAllDevices(userId);
    return response.data;
  } catch (err) {
    console.error('logoutUserFromAllDevicesService error:', err.response || err);
    throw err.response?.data || { message: 'Failed to logout user from all devices.' };
  }
};

const revokeUserSessionService = async (userId, sessionId) => {
  try {
    const response = await revokeUserSession(userId, sessionId);
    return response.data;
  } catch (err) {
    console.error('revokeUserSessionService error:', err.response || err);
    throw err.response?.data || { message: 'Failed to revoke user session.' };
  }
};

export const profileService = {
  fetchProfile: fetchUserProfileService,
  updateProfile: updateUserProfileService,
  deleteProfile: deleteUserProfileService,
  changePassword: changeUserPasswordService,
  fetchPosts: fetchUserPostsService,
  fetchAchievements: fetchUserAchievementsService,
  fetchActiveSessions: fetchUserActiveSessionsService,
  logoutAllDevices: logoutUserFromAllDevicesService,
  revokeSession: revokeUserSessionService,
};
