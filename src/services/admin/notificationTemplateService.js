import {
    fetchNotificationTemplates,
    createNotificationTemplate,
    updateNotificationTemplate,
    deleteNotificationTemplate,
} from "../../api/admin/notificationTemplateApi";

const fetchNotificationTemplatesService = async (params = {}) => {
    try {
        const response = await fetchNotificationTemplates(params);
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Failed to fetch notification templates." };
    }
};

const createNotificationTemplateService = async (templateData) => {
    try {
        const response = await createNotificationTemplate(templateData);
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Failed to create notification template." };
    }
};

const updateNotificationTemplateService = async (id, templateData) => {
    try {
        const response = await updateNotificationTemplate(id, templateData);
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Failed to update notification template." };
    }
};

const deleteNotificationTemplateService = async (id) => {
    try {
        const response = await deleteNotificationTemplate(id);
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Failed to delete notification template." };
    }
};

export const notificationTemplateService = {
    fetch: fetchNotificationTemplatesService,
    create: createNotificationTemplateService,
    update: updateNotificationTemplateService,
    delete: deleteNotificationTemplateService,
};
