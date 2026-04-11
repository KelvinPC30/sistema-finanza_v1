import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth endpoints
export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getUser: () => api.get('/auth/user'),
};

// Dashboard endpoints
export const dashboardService = {
    getData: () => api.get('/dashboard'),
};

// Account endpoints
export const accountService = {
    getAll: () => api.get('/accounts'),
    getOne: (id) => api.get(`/accounts/${id}`),
    create: (data) => api.post('/accounts', data),
    update: (id, data) => api.put(`/accounts/${id}`, data),
    delete: (id) => api.delete(`/accounts/${id}`),
};

// Transaction endpoints
export const transactionService = {
    getAll: (accountId) => api.get(`/accounts/${accountId}/transactions`),
    create: (accountId, data) => api.post(`/accounts/${accountId}/transactions`, data),
};

export default api;