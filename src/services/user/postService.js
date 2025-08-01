import {
  fetchPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  reportPost,
  castVote,
  likePost, // <--- Import the new API function
  dislikePost,
  fetchPopularPosts, // <--- Import the new API function
  toggleEventInterest,
  toggleEventRSVP
} from "../../api/user/postApi";

export const fetchPostsService = async (params = {}) => {
  try {
    const response = await fetchPosts(params);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch posts" };
  }
};

export const fetchAllPopularPostsService = async ({ pageParam = 1 }) => {
  try {
    const response = await fetchPopularPosts(pageParam);
    console.log(response.data);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch posts" };
  }
};

export const getPostService = async (id) => {
  try {
    const response = await getPost(id);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to get post" };
  }
};

export const createPostService = async (postData) => {
  try {
    const response = await createPost(postData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to create post" };
  }
};

export const updatePostService = async (id, updateData) => {
  try {
    const response = await updatePost(id, updateData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to update post" };
  }
};

export const deletePostService = async (id) => {
  try {
    const response = await deletePost(id);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to delete post" };
  }
};

export const reportPostService = async (id, reason, type) => {
  try {
    const response = await reportPost(id, reason, type);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to report post" };
  }
};

export const likePostService = async (postId) => {
  try {
    const response = await likePost(postId);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to like post" };
  }
};

export const dislikePostService = async (postId) => {
  try {
    const response = await dislikePost(postId);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to dislike post" };
  }
};

export const toggleEventInterestService = async (eventId) => {
  try {
    const response = await toggleEventInterest(eventId);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to toggle event interest" };
  }
};

export const toggleEventRSVPService = async (eventId) => {
  try {
    const response = await toggleEventRSVP(eventId);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to toggle event RSVP" };
  }
};

export const castVoteService = async (postId, optionIndex) => {
  try {
    const response = await castVote(postId, optionIndex);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to cast vote" };
  }
};
