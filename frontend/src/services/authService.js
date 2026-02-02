import api from '@/lib/api';

export const authService = {
  async register(data) {
    const response = await api.post('/auth/register', data);
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },

  logout() {
    localStorage.removeItem('token');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  async getCurrentUser() {
    return await api.get('/auth/me');
  },

  async forgotPassword(email) {
    return await api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token, newPassword) {
    return await api.post('/auth/reset-password', { token, newPassword });
  },

  async verifyEmail(token) {
    return await api.post('/auth/verify-email', { token });
  },

  isAuthenticated() {
    return typeof window !== 'undefined' && !!localStorage.getItem('token');
  },
};
