import api from './api';

export const authService = {
    // Store the token and user data
    setAuth(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Get the stored token
    getToken() {
        return localStorage.getItem('token');
    },

    // Get the stored user data
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    },

    // Clear auth data (logout)
    clearAuth() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Login
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            this.setAuth(response.data.token, response.data.user);
        }
        return response.data;
    },

    // Logout
    async logout() {
        try {
            await api.post('/auth/logout');
        } finally {
            this.clearAuth();
        }
    }
};
