import axios from 'axios';
import { testimonials, stats, categories, contacts } from '../data/staticData';

const API_URL = 'https://694d3b45ad0f8c8e6e201c26.mockapi.io';
// const API_URL = 'http://localhost:3000';

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

// Orders
export const getOrders = () => api.get('/orders');
export const createOrder = (orderData) => api.post('/orders', orderData);

// Contacts
export const getContacts = () => Promise.resolve({ data: contacts });
export const createContact = (contactData) => {
    // Simulation du stockage (ne persiste pas car fichiers statiques)
    console.log("Contact reçu (simulation):", contactData);
    return Promise.resolve({ data: contactData });
};

// Categories
export const getCategories = () => Promise.resolve({ data: categories });

export default api;

// Stats
export const getStats = () => Promise.resolve({ data: stats });
export const updateStats = (statsData) => {
    console.log("Mise à jour stats (simulation):", statsData);
    return Promise.resolve({ data: { ...stats, ...statsData } });
};

// Testimonials
export const getTestimonials = () => Promise.resolve({ data: testimonials });
