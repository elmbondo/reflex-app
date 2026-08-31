// Shared API helper — everyone imports this instead of writing raw fetch/axios calls
// Keeps all persona screens talking to the backend the same, consistent way

import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || (window.location.hostname !== 'localhost' ? '/api' : 'http://localhost:5000/api');

export const api = axios.create({ baseURL: API_BASE });

// Delivery-related calls
export const getDeliveries = () => api.get('/deliveries');
export const createDelivery = (data) => api.post('/deliveries', data);
export const assignRider = (id, data) => api.patch(`/deliveries/${id}/assign`, data);
export const updateStatus = (id, data) => api.patch(`/deliveries/${id}/status`, data);

// Fetch all riders from the backend
export const getRiders = async () => {
  const response = await api.get('/riders');
  return response.data;
};

