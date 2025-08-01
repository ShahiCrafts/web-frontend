import { fetchDiscussions, togglePinStatus, fetchModerationDiscussions } from "../../api/admin/discussionApi";

const fetchDiscussionsService = async (params = {}) => {
  try {
    const response = await fetchDiscussions(params);
    return response.data.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch discussions." };
  }
};

const togglePinStatusService = async (discussionId) => {
  try {
    const response = await togglePinStatus(discussionId);
    return response.data.data;
  } catch (err) {
    throw (
      err.response?.data || {
        message: "Failed to toggle discussion pin status.",
      }
    );
  }
};

const fetchModerationDiscussionsService = async (params = {}) => {
  try {
    const response = await fetchModerationDiscussions(params);
    return response.data.data;
  } catch (err) {
    throw (
      err.response?.data || {
        message: "Failed to fetch moderation discussions.",
      }
    );
  }
};

export const discussionService = {
  fetch: fetchDiscussionsService,
  togglePin: togglePinStatusService,
  fetchModeration: fetchModerationDiscussionsService,
};