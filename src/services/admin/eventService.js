import {
  fetchEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} from '../../api/admin/eventManagementApi';

/**
 * Service to fetch announcements with optional filters and pagination.
 *
 * @param {Object} params - Query parameters for announcement filtering and pagination.
 * @returns {Promise<Object>} The response data from the API.
 * @throws {Object} Error response from the API or a fallback error object.
 */
const fetchEventsService = async (params = {}) => {
  try {
    const response = await fetchEvents(params);
    return response.data;
  } catch (err) {
    console.error("fetchEventsService error:", err.response || err);
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
const getEventService = async (id) => {
  try {
    const response = await getEvent(id);
    return response.data;
  } catch (err) {
    console.error("getEventService error:", err.response || err);
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
const createEventService = async (announcementData) => {
  try {
    const response = await createEvent(announcementData);
    return response.data;
  } catch (err) {
    console.error("createEventService error:", err.response || err);
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
const updateEventService = async (id, updateData) => {
  try {
    const response = await updateEvent(id, updateData);
    return response.data;
  } catch (err) {
    console.error("updateEventService error:", err.response || err);
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
const deleteEventService = async (id) => {
  try {
    const response = await deleteEvent(id);
    return response.data;
  } catch (err) {
    console.error("deleteEventService error:", err.response || err);
    throw err.response?.data || { message: 'Failed to delete announcement.' };
  }
};

export const eventService = {
  fetch: fetchEventsService,
  getById: getEventService,
  create: createEventService,
  update: updateEventService,
  delete: deleteEventService,
};
