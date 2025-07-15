import {
  fetchNotifications,
  fetchNotificationCounts,
  markNotificationsAsRead,
  deleteNotifications,
} from '../../api/admin/notificationApi'; // Import the API functions

/**
 * Service to fetch a paginated list of notifications for the current user.
 * @param {Object} params - Query parameters like page, limit, read, seen.
 * @returns {Promise<Object>} The response data from the API.
 * @throws {Object} Error response from the API or a fallback error object.
 */
const fetchNotificationsService = async (params = {}) => {
  try {
    const response = await fetchNotifications(params);
    return response.data;
  } catch (err) {
    console.error("fetchNotificationsService error:", err.response || err);
    throw err.response?.data || { message: 'Failed to fetch notifications.' };
  }
};

/**
 * Service to fetch unread/unseen counts for the current user's notifications.
 * @returns {Promise<Object>} Object with { unread: number, unseen: number }.
 * @throws {Object} Error response from the API or a fallback error object.
 */
const fetchNotificationCountsService = async () => {
  try {
    const response = await fetchNotificationCounts();
    return response.data;
  } catch (err) {
    console.error("fetchNotificationCountsService error:", err.response || err);
    throw err.response?.data || { message: 'Failed to fetch notification counts.' };
  }
};

/**
 * Service to mark one or more notifications as read.
 * @param {string[]|'all'} notificationIds - Array of notification IDs or 'all'.
 * @returns {Promise<Object>} API response data.
 * @throws {Object} Error response or fallback error.
 */
const markNotificationsAsReadService = async (notificationIds) => {
  try {
    const response = await markNotificationsAsRead(notificationIds);
    return response.data;
  } catch (err) {
    console.error("markNotificationsAsReadService error:", err.response || err);
    throw err.response?.data || { message: 'Failed to mark notifications as read.' };
  }
};

/**
 * Service to delete one or more notifications.
 * @param {string[]|'all'} notificationIds - Array of notification IDs or 'all'.
 * @returns {Promise<Object>} API response data.
 * @throws {Object} Error response or fallback error.
 */
const deleteNotificationsService = async (notificationIds) => {
  try {
    const response = await deleteNotifications(notificationIds);
    return response.data;
  } catch (err) {
    console.error("deleteNotificationsService error:", err.response || err);
    throw err.response?.data || { message: 'Failed to delete notifications.' };
  }
};

// Export all notification services in a single object
export const notificationService = {
  fetch: fetchNotificationsService,
  fetchCounts: fetchNotificationCountsService,
  markAsRead: markNotificationsAsReadService,
  delete: deleteNotificationsService,
};