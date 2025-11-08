import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (updates) => api.put('/auth/profile', updates),
  changePassword: (passwords) => api.post('/auth/change-password', passwords),
};

// Flight API
export const flightAPI = {
  search: (params) => api.get('/flights/search', { params }),
  filter: (data) => api.post('/flights/filter', data),
  getAirports: (search) => api.get('/flights/airports', { params: { search } }),
  getDetails: (flightId) => api.get(`/flights/${flightId}`),
};

// Booking API
export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: (params) => api.get('/bookings', { params }),
  getById: (bookingId) => api.get(`/bookings/${bookingId}`),
  getByPNR: (pnr) => api.get(`/bookings/pnr/${pnr}`),
  confirm: (bookingId, paymentData) => api.post(`/bookings/${bookingId}/confirm`, paymentData),
  cancel: (bookingId, reason) => api.post(`/bookings/${bookingId}/cancel`, { reason }),
};

export default api;
