import { fetchUsers, deleteUsers } from '../../api/admin/userManagementApi'; // adjust the path if needed

/**
 * Service to fetch users with optional filters and pagination.
 *
 * @param {Object} params - Query parameters for user filtering and pagination.
 * @returns {Promise<Object>} The response data from the API.
 * @throws {Object} Error response from the API or a fallback error object.
 */
const fetchUsersService = async (options = {}) => {
  try {
    const response = await fetchUsers(options);
    return response.data;
  } catch (err) {
    console.error("fetchUsersService error:");
    console.error("Error object:", err);
    console.error("Error response:", err.response);
    throw err.response?.data || { message: 'Failed to fetch users.' };
  }
};

/**
 * Service to hard delete a user by id.
 *
 * @param {string} id - User ID to delete.
 * @returns {Promise<Object>} API response data.
 * @throws {Object} Error response or fallback error.
 */
const deleteUserService = async (id) => {
  try {
    const response = await deleteUsers(id);
    return response.data;
  } catch (err) {
    console.error("deleteUserService error:", err);
    throw err.response?.data || { message: 'Failed to delete user.' };
  }
};

export const adminUserService = {
  fetchUsersService,
  deleteUserService,
};