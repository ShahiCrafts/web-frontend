import {
  fetchEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../api/admin/eventManagementApi";

const fetchEventsService = async (params = {}) => {
  try {
    const response = await fetchEvents(params);
    return response.data.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch events." };
  }
};

const getEventByIdService = async (id) => {
  try {
    const response = await getEventById(id);
    return response.data.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch the event." };
  }
};

const createEventService = async (eventData) => {
  try {
    const response = await createEvent(eventData);
    return response.data.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to create event." };
  }
};

const updateEventService = async (id, updateData) => {
  try {
    const response = await updateEvent(id, updateData);
    return response.data.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to update event." };
  }
};

const deleteEventService = async (id) => {
  try {
    const response = await deleteEvent(id);
    return response.data.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to delete event." };
  }
};

export const eventService = {
  fetch: fetchEventsService,
  getById: getEventByIdService,
  create: createEventService,
  update: updateEventService,
  delete: deleteEventService,
};