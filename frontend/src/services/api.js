import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const cartService = {
    async getCart() {
        const response = await api.get('/cart');
        return response.data;
    },

    async addToCart(productId, quantity) {
        const response = await api.post('/cart/add', { productId, quantity });
        return response.data;
    },

    async updateQuantity(productId, quantity) {
        const response = await api.put('/cart/update', { productId, quantity });
        return response.data;
    },

    async removeFromCart(productId) {
        const response = await api.delete(`/cart/remove/${productId}`);
        return response.data;
    },

    async clearCart() {
        const response = await api.delete('/cart/clear');
        return response.data;
    }
};

export default api;
