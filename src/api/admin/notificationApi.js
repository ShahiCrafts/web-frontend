import instance from '../api'; // Assuming your Axios instance is exported as 'instance'

const URL = 'notifications'; // Base URL for notification API

/**
 * Fetches a paginated list of notifications for the current user.
 * @param {Object} params - Query parameters like page, limit, read, seen.
 * @returns {Promise<Object>} - Axios response object.
 */
export const fetchNotifications = (params = {}) => {
  return instance.get(`/${URL}`, { params });
};

/**
 * Fetches unread/unseen counts for the current user's notifications.
 * @returns {Promise<Object>} - Axios response object.
 */
export const fetchNotificationCounts = () => {
  return instance.get(`/${URL}/counts`);
};

/**
 * Marks one or more notifications as read.
 * @param {string[]|'all'} notificationIds - Array of notification IDs or 'all'.
 * @returns {Promise<Object>} - Axios response object.
 */
export const markNotificationsAsRead = (notificationIds) => {
  const payload = notificationIds === 'all' ? { markAll: true } : { notificationIds };
  return instance.patch(`/${URL}/mark-read`, payload);
};

/**
 * Deletes one or more notifications.
 * @param {string[]|'all'} notificationIds - Array of notification IDs or 'all'.
 * @returns {Promise<Object>} - Axios response object.
 */
export const deleteNotifications = (notificationIds) => {
  const payload = notificationIds === 'all' ? { deleteAll: true } : { notificationIds };
  // For DELETE requests with a body, Axios requires the body to be in the 'data' property of the config object.
  return instance.delete(`/${URL}`, { data: payload });
};