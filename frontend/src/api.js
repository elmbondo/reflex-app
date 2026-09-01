// Shared API helper — everyone imports this instead of writing raw fetch/axios calls
// Keeps all persona screens talking to the backend the same, consistent way

import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || (window.location.hostname !== 'localhost' ? '/api' : 'http://localhost:5000/api');

export const api = axios.create({ baseURL: API_BASE });

// Automatically attach JWT token to all requests if stored in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('reflex_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Authentication endpoints
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const getMyProfile = () => api.get('/auth/me');

// Admin Approval & Management endpoints
export const getApplications = (params) => api.get('/admin/applications', { params });
export const approveApplication = (id, data) => api.patch(`/admin/applications/${id}/approve`, data);
export const rejectApplication = (id) => api.patch(`/admin/applications/${id}/reject`);
export const getAdminStats = () => api.get('/admin/stats');

// Delivery-related calls
export const getDeliveries = () => api.get('/deliveries');
export const createDelivery = (data) => api.post('/deliveries', data);
export const assignRider = (id, data) => api.patch(`/deliveries/${id}/assign`, data);
export const updateStatus = (id, data) => api.patch(`/deliveries/${id}/status`, data);

// Fetch all approved riders from the backend
export const getRiders = async () => {
  const response = await api.get('/riders');
  return response.data;
};

// Support endpoint (public)
export const submitSupportTicket = (ticketData) => api.post('/support', ticketData);

