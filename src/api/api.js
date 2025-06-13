import axios from "axios";

/**
 * Axios instance configured with a base API URL and default headers.
 * 
 * The base URL is taken from the environment variable `VITE_API_BASE_URL`.
 * If the environment variable is not defined, it falls back to 
 * `'localhost:8080/api'`.
 * 
 * This instance can be used throughout the application to make HTTP 
 * requests with consistent configuration.
 * 
 * @constant
 * @type {import('axios').AxiosInstance}
 */
const API_URL = import.meta.env.VITE_API_BASE_URL || "localhost:8080/";

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Attach auth token to each request if available
instance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getAuthToken = () => {
  const token = localStorage.getItem('token')
  return token;
}

export default instance;
