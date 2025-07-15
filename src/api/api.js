import axios from 'axios';

// Get the token from localStorage. In a real app, this might be more complex.
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create an Axios instance with the backend base URL.
// Using VITE_API_BASE_URL from .env is a good practice for production.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

// --- Axios Request Interceptor ---
// This function will run before every request made with this 'api' instance.
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    
    // If a token exists, add it to the Authorization header for the outgoing request.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Handle any errors that occur during the request setup.
    return Promise.reject(error);
  }
);

export default api;
