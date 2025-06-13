import {
  sendVerificationCode,
  verifyCode,
  createAccountAPI,
  login
} from "../api/authApi";

/**
 * Sends a verification code to the user's email or phone.
 *
 * @param {Object} email - Payload containing details such as email, role, etc.
 * @returns {Promise<Object>} - Response data from the backend.
 * @throws {Object} - Error object with a message or validation details.
 */
export const sendVerificationCodeService = async (email) => {
  try {
    const response = await sendVerificationCode(email);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to send verification code" };
  }
};

/**
 * Verifies the OTP/code entered by the user.
 *
 * @param {Object} code - Payload containing the OTP code and user information.
 * @returns {Promise<Object>} - Response data from the backend.
 * @throws {Object} - Error object with a message or validation details.
 */
export const verifyCodeService = async ({email, code}) => {
  try {
    const response = await verifyCode({ email, code });
    return response.data;
  } catch (err) {
    console.error("Server error:", err.response?.data);
    throw err.response?.data || { message: "Verification failed" };
  }
};

/**
 * Creates a new user account after verification.
 *
 * @param {Object} userData - User registration data including full name, email, password, role, etc.
 * @returns {Promise<Object>} - Response data from the backend.
 * @throws {Object} - Error object with a message or validation details.
 */
export const createAccountService = async (userData) => {
  try {
    const response = await createAccountAPI(userData);
    return response.data;
  } catch (err) {
    const errorData = err?.response?.data;
    const message = errorData?.message || "Account creation failed";
    throw { ...errorData, message };
  }
};

/**
 * Logs in a user with provided credentials.
 *
 * @param {Object} credentials - Object containing `email` and `password`.
 * @returns {Promise<Object>} - Response data from the backend.
 * @throws {Object} - Error object with a message or validation details.
 */
export const loginUserService = async (credentials) => {
  try {
    const response = await login(credentials);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};
