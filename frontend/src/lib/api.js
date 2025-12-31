import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Handle 401 (unauthorized) - redirect to login
      if (error.response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      // Return error message from server
      return Promise.reject(
        error.response.data.error || 'Something went wrong'
      );
    }

    // Network error
    return Promise.reject('Network error. Please check your connection.');
  }
);

export default api;
