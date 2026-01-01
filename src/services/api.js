import axios from 'axios';
const API_URL = 'https://69524f4e3b3c518fca123101.mockapi.io';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Events
export const getEvents = () => api.get('/events');
export const getEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (eventData) => api.post('/events', eventData);
export const updateEvent = (id, eventData) => api.put(`/events/${id}`, eventData);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export default api;
// orders
export const getOrders = () => api.get('/orders');
export const createOrder = (orderData) => api.post('/orders', orderData);

