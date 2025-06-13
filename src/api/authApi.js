import axios from './api';

/**
 * Sends a verification code to the user's email or phone number.
 *
 * @param {Object} data - Payload containing user role and user_id(e.g., role or user_id).
 * @returns {Promise<import('axios').AxiosResponse>} Axios response promise.
 */
export const sendVerificationCode = (data) =>
  axios.post('/auth/send-verification-code', data);

/**
 * Verifies the OTP or code sent to the user.
 *
 * @param {Object} data - Payload containing the verification code and associated user info.
 * @returns {Promise<import('axios').AxiosResponse>} Axios response promise.
 */
export const verifyCode = (data) =>
  axios.post('/auth/verify-code', data);

/**
 * Creates a new user account after successful code verification.
 *
 * @param {Object} data - Payload with user registration details (e.g., name, password, etc.).
 * @returns {Promise<import('axios').AxiosResponse>} Axios response promise.
 */
export const createAccountAPI = (data) =>
  axios.post('/auth/register', data);

/**
 * Authenticates the user with email and password.
 *
 * @param {Object} credentials - Login credentials (e.g., email and password).
 * @returns {Promise<import('axios').AxiosResponse>} Axios response promise.
 */
export const login = (credentials) => {
    return axios.post('/auth/login', credentials)
}