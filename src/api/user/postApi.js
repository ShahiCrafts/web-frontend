import instance from '../api'; // Assuming 'instance' is your configured Axios instance

const URL = 'posts';

export const fetchPosts = (params = {}) => {
  return instance.get(`/${URL}/fetch/all`, { params });
};

export const getPost = (id) => {
  const fullUrl = `/${URL}/fetch/${id}`;
  console.log("🔍 GET POST URL:", fullUrl);
  return instance.get(fullUrl);
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

// --- NEW FUNCTION FOR POLL VOTING ---
/**
 * Casts a vote on a specific poll option.
 * @param {string} pollId - The ID of the poll post.
 * @param {string} optionLabel - The label of the option being voted for.
 * @returns {Promise} A promise that resolves with the API response.
 */
export const castVote = (pollId, optionLabel) => {
  const fullUrl = `/${URL}/${pollId}/vote`;
  console.log("🗳️ CAST VOTE URL:", fullUrl);
  return instance.post(fullUrl, { optionLabel });
};

// --- OPTIONAL: Function to get specific poll stats if needed separately ---
/**
 * Fetches detailed statistics for a specific poll.
 * NOTE: getPost already fetches poll data with stats if it's a poll,
 * so this might be redundant unless you need a dedicated endpoint.
 * @param {string} pollId - The ID of the poll post.
 * @returns {Promise} A promise that resolves with the poll statistics.
 */
export const getPollStats = (pollId) => {
  const fullUrl = `/${URL}/${pollId}/poll-stats`;
  console.log("📊 GET POLL STATS URL:", fullUrl);
  return instance.get(fullUrl);
};