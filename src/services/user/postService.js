import {
  fetchPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  reportPost,
  castVote, // <-- Import the new API function
  getPollStats, // <-- Import the optional new API function
} from '../../api/user/postApi';

export const fetchPostsService = async (params = {}) => {
  try {
    const response = await fetchPosts(params);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to fetch posts' };
  }
};

export const getPostService = async (id) => {
  try {
    const response = await getPost(id);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to get post' };
  }
};

export const createPostService = async (postData) => {
  try {
    const response = await createPost(postData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to create post' };
  }
};

export const updatePostService = async (id, updateData) => {
  try {
    const response = await updatePost(id, updateData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to update post' };
  }
};

export const deletePostService = async (id) => {
  try {
    const response = await deletePost(id);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to delete post' };
  }
};

export const reportPostService = async (id, reason, type) => {
  try {
    const response = await reportPost(id, reason, type);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to report post' };
  }
};

// --- NEW SERVICE FUNCTION FOR POLL VOTING ---
export const castVoteService = async (pollId, optionLabel) => {
  try {
    const response = await castVote(pollId, optionLabel);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to cast vote' };
  }
};

// --- OPTIONAL: NEW SERVICE FUNCTION FOR GETTING POLL STATS ---
// (Only needed if you use getPollStats API endpoint separately from getPost)
export const getPollStatsService = async (pollId) => {
  try {
    const response = await getPollStats(pollId);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to fetch poll statistics' };
  }
};