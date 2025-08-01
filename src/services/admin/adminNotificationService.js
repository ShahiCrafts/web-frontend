import {
  fetchAllAdminNotifications,
  createAndSendNotification,
  scheduleNotification,
} from "../../api/admin/adminNotificationApi";

const fetchAllAdminNotificationsService = async (params = {}) => {
  try {
    const response = await fetchAllAdminNotifications(params);
    return response.data; // Extract the nested 'data' object
  } catch (err) {
    throw (
      err.response?.data || { message: "Failed to fetch admin notifications." }
    );
  }
};

const createAndSendNotificationService = async (notificationData) => {
  try {
    const response = await createAndSendNotification(notificationData);
    return response.data;
  } catch (err) {
    throw (
      err.response?.data || {
        message: "Failed to create and send notification.",
      }
    );
  }
};

const scheduleNotificationService = async (notificationData) => {
  try {
    const response = await scheduleNotification(notificationData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to schedule notification." };
  }
};

export const adminNotificationService = {
  fetch: fetchAllAdminNotificationsService,
  send: createAndSendNotificationService,
  schedule: scheduleNotificationService,
};
