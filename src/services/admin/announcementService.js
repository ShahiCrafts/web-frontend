import {
  fetchAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '../../api/admin/announcementManagementApi';

/**
 * Service to fetch announcements with optional filters and pagination.
 *
 * @param {Object} params - Query parameters for announcement filtering and pagination.
 * @returns {Promise<Object>} The response data from the API.
 * @throws {Object} Error response from the API or a fallback error object.
 */
const fetchAnnouncementsService = async (params = {}) => {
  try {
    const response = await fetchAnnouncements(params);
    return response.data; // Assuming axios instance returns data property
  } catch (err) {
    console.error("fetchAnnouncementsService error:", err.response || err);
    throw err.response?.data || { message: 'Failed to fetch announcements.' };
  }
};

/**
 * Service to fetch a single announcement by its ID.
 *
 * @param {string} id - The ID of the announcement to retrieve.
 * @returns {Promise<Object>} API response data.
 * @throws {Object} Error response or fallback error.
 */
const getAnnouncementService = async (id) => {
  try {
    const response = await getAnnouncement(id);
    return response.data;
  } catch (err) {
    console.error("getAnnouncementService error:", err.response || err);
    throw err.response?.data || { message: 'Failed to fetch the announcement.' };
  }
};

/**
 * Service to create a new announcement.
 *
 * @param {object} announcementData - The data for the new announcement.
 * @returns {Promise<Object>} API response data.
 * @throws {Object} Error response or fallback error.
 */
const createAnnouncementService = async (announcementData) => {
  try {
    const response = await createAnnouncement(announcementData);
    return response.data;
  } catch (err) {
    console.error("createAnnouncementService error:", err.response || err);
    throw err.response?.data || { message: 'Failed to create announcement.' };
  }
};

/**
 * Service to update an existing announcement.
 *
 * @param {string} id - The ID of the announcement to update.
 * @param {object} updateData - The data to update the announcement with.
 * @returns {Promise<Object>} API response data.
 * @throws {Object} Error response or fallback error.
 */
const updateAnnouncementService = async (id, updateData) => {
  try {
    const response = await updateAnnouncement(id, updateData);
    return response.data;
  } catch (err) {
    console.error("updateAnnouncementService error:", err.response || err);
    throw err.response?.data || { message: 'Failed to update announcement.' };
  }
};

/**
 * Service to delete an announcement by its ID.
 *
 * @param {string} id - The ID of the announcement to delete.
 * @returns {Promise<Object>} API response data.
 * @throws {Object} Error response or fallback error.
 */
const deleteAnnouncementService = async (id) => {
  try {
    const response = await deleteAnnouncement(id);
    return response.data;
  } catch (err) {
    console.error("deleteAnnouncementService error:", err.response || err);
    throw err.response?.data || { message: 'Failed to delete announcement.' };
  }
};

export const announcementService = {
  fetch: fetchAnnouncementsService,
  getById: getAnnouncementService,
  create: createAnnouncementService,
  update: updateAnnouncementService,
  delete: deleteAnnouncementService,
};
