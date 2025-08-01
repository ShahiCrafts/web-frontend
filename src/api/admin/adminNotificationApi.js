import instance from "../api";

const NOTIFICATION_URL = "admin/notifications";
const TEMPLATE_URL = "admin/notification-templates";

export const createAndSendNotification = (notificationData) => {
  return instance.post(`/${NOTIFICATION_URL}/send`, notificationData);
};

export const fetchAllAdminNotifications = (params = {}) => {
  return instance.get(`/${NOTIFICATION_URL}`, { params });
};

export const scheduleNotification = (notificationData) => {
  return instance.post(`/${NOTIFICATION_URL}/schedule`, notificationData);
};

export const fetchNotificationTemplates = (params = {}) => {
  return instance.get(`/${TEMPLATE_URL}`, { params });
};

export const createNotificationTemplate = (templateData) => {
  return instance.post(`/${TEMPLATE_URL}`, templateData);
};

export const updateNotificationTemplate = (id, templateData) => {
  return instance.patch(`/${TEMPLATE_URL}/${id}`, templateData);
};

export const deleteNotificationTemplate = (id) => {
  return instance.delete(`/${TEMPLATE_URL}/${id}`);
};
