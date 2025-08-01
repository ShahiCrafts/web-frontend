import {
  fetchPolls,
  getPollById,
  createPoll,
  updatePoll,
  deletePoll,
} from "../../api/admin/pollManagementApi";

const fetchPollsService = async (params = {}) => {
  try {
    const response = await fetchPolls(params);
    return response.data.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch polls." };
  }
};

const getPollByIdService = async (id) => {
  try {
    const response = await getPollById(id);
    return response.data.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch the poll." };
  }
};

const createPollService = async (pollData) => {
  try {
    const response = await createPoll(pollData);
    return response.data.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to create poll." };
  }
};

const updatePollService = async (id, updateData) => {
  try {
    const response = await updatePoll(id, updateData);
    return response.data.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to update poll." };
  }
};

const deletePollService = async (id) => {
  try {
    const response = await deletePoll(id);
    return response.data.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to delete poll." };
  }
};

export const pollService = {
  fetch: fetchPollsService,
  getById: getPollByIdService,
  create: createPollService,
  update: updatePollService,
  delete: deletePollService,
};