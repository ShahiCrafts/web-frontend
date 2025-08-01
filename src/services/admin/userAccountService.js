import { fetchUsers, deleteUsers, getUserEngagementAnalytics, toggleUserBanStatus } from "../../api/admin/userManagementApi";

const fetchUsersService = async (options = {}) => {
  try {
    const response = await fetchUsers(options);
    return response.data;
  } catch (err) {
    console.error("fetchUsersService error:");
    console.error("Error object:", err);
    console.error("Error response:", err.response);
    throw err.response?.data || { message: "Failed to fetch users." };
  }
};

const deleteUserService = async (id) => {
  try {
    const response = await deleteUsers(id);
    return response.data;
  } catch (err) {
    console.error("deleteUserService error:", err);
    throw err.response?.data || { message: "Failed to delete user." };
  }
};

const fetchUserEngagementAnalyticsService = async () => {
  try {
    const response = await getUserEngagementAnalytics();
    return response.data.data;
  } catch (err) {
    console.error("fetchUserEngagementAnalyticsService error:", err);
    throw (
      err.response?.data || {
        message: "Failed to fetch user engagement analytics.",
      }
    );
  }
};

const toggleUserBanStatusService = async (id) => {
  try {
    const response = await toggleUserBanStatus(id);
    return response.data;
  } catch (err) {
    console.error("toggleUserBanStatusService error:", err);
    throw (
      err.response?.data || { message: "Failed to toggle user ban status." }
    );
  }
};

export const adminUserService = {
  fetchUsersService,
  deleteUserService,
  fetchUserEngagementAnalyticsService,
  toggleUserBanStatusService,
};
