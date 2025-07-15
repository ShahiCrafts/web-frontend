// src/api/communityApi.js

import instance from '../api/api'; // Assuming 'instance' is your configured Axios instance

const URL = 'communities'; // Base URL for community API routes

/**
 * Creates a new community.
 * Corresponds to POST /api/communities
 * @param {Object} communityData - The data for the new community (name, description, category, privacy, tags).
 * @returns {Promise<AxiosResponse>} - Axios response object.
 */
export const createCommunityApi = (communityData) => {
  return instance.post(`/${URL}`, communityData);
};

export const listUserOwnedCommunitiesApi = () => {
  return instance.get(`/${URL}/my-communities`);
};
/**
 * Fetches a paginated list of approved communities.
 * Corresponds to GET /api/communities
 * @param {Object} params - Query parameters (e.g., page, limit, search, category, privacy).
 * @returns {Promise<AxiosResponse>} - Axios response object.
 */
export const listApprovedCommunitiesApi = (params = {}) => {
  return instance.get(`/${URL}`, { params });
};

/**
 * Fetches details for a specific community by its slug.
 * Corresponds to GET /api/communities/:slug
 * @param {string} slug - The slug of the community.
 * @returns {Promise<AxiosResponse>} - Axios response object.
 */
export const getCommunityDetailsApi = (slug) => {
  return instance.get(`/${URL}/${slug}`);
};

/**
 * Fetches a list of communities pending approval (Admin only).
 * Corresponds to GET /api/communities/admin/pending
 * @returns {Promise<AxiosResponse>} - Axios response object containing an array of pending communities.
 */
export const listPendingCommunitiesApi = () => {
  return instance.get(`/${URL}/admin/pending`);
};

/**
 * Reviews a community (approves or rejects) (Admin only).
 * Corresponds to POST /api/communities/admin/review/:communityId
 * @param {string} communityId - The ID of the community to review.
 * @param {string} action - 'approve' or 'reject'.
 * @param {string} [rejectionReason=''] - Optional reason for rejection.
 * @returns {Promise<AxiosResponse>} - Axios response object.
 */
export const reviewCommunityApi = (communityId, action, rejectionReason = '') => {
  return instance.post(`/${URL}/admin/review/${communityId}`, { action, rejectionReason });
};