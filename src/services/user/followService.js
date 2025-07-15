import {
  followUser,
  unfollowUser,
  checkFollowingStatus,
  getFollowing,
  getFollowers,
} from '../../api/user/followApi';

export const followUserService = async (userId) => {
  try {
    const response = await followUser(userId);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to follow user' };
  }
};

export const unfollowUserService = async (userId) => {
  try {
    const response = await unfollowUser(userId);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to unfollow user' };
  }
};

export const checkFollowingStatusService = async (userId) => {
  try {
    const response = await checkFollowingStatus(userId);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to check follow status' };
  }
};

export const getFollowingService = async (userId, params = {}) => {
  try {
    const response = await getFollowing(userId, params);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to get following list' };
  }
};

export const getFollowersService = async (userId, params = {}) => {
  try {
    const response = await getFollowers(userId, params);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to get followers list' };
  }
};
