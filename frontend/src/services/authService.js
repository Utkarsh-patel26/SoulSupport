import api from '@/lib/api';

export const authService = {
  async register(data) {
    const response = await api.post('/auth/register', data);
    const payload = response.data?.data ?? response.data ?? {};
    if (payload?.token) {
      localStorage.setItem('token', payload.token);
    }
    return payload;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const payload = response.data?.data ?? response.data ?? {};
    if (payload?.token) {
      localStorage.setItem('token', payload.token);
    }
    return payload;
  },

  logout() {
    localStorage.removeItem('token');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data?.data ?? response.data ?? {};
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
