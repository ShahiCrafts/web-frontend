// src/services/communityService.js

import {
  createCommunityApi,
  listApprovedCommunitiesApi,
  getCommunityDetailsApi,
  listPendingCommunitiesApi,
  reviewCommunityApi,
  listUserOwnedCommunitiesApi
} from '../api/communityApi'; // Adjust path if necessary

/**
 * Service to create a new community.
 * @param {Object} communityData - The data for the new community.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Object} - Error object with a 'message' property.
 */
export const createCommunity = async (communityData) => {
  try {
    const response = await createCommunityApi(communityData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to create community' };
  }
};

export const listUserOwnedCommunities = async () => {
  try {
    const response = await listUserOwnedCommunitiesApi();
    return response.data; // Expects { communities: [...] }
  } catch (err) {
    throw err.response?.data || { message: 'Failed to fetch your communities' };
  }
};

/**
 * Service to fetch a paginated list of approved communities.
 * @param {Object} params - Query parameters.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Object} - Error object with a 'message' property.
 */
export const listApprovedCommunities = async (params = {}) => {
  try {
    const response = await listApprovedCommunitiesApi(params);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to fetch approved communities' };
  }
};

/**
 * Service to fetch details for a specific community by its slug.
 * @param {string} slug - The slug of the community.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Object} - Error object with a 'message' property.
 */
export const getCommunityDetails = async (slug) => {
  try {
    const response = await getCommunityDetailsApi(slug);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to get community details' };
  }
};

/**
 * Service to fetch a list of communities pending approval (Admin only).
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Object} - Error object with a 'message' property.
 */
export const listPendingCommunities = async () => {
  try {
    const response = await listPendingCommunitiesApi();
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to fetch pending communities' };
  }
};

/**
 * Service to review a community (approves or rejects) (Admin only).
 * @param {string} communityId - The ID of the community to review.
 * @param {string} action - 'approve' or 'reject'.
 * @param {string} [rejectionReason=''] - Optional reason for rejection.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Object} - Error object with a 'message' property.
 */
export const reviewCommunity = async (communityId, action, rejectionReason = '') => {
  try {
    const response = await reviewCommunityApi(communityId, action, rejectionReason);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to review community' };
  }
};