import api from '@/lib/api';

export const sessionService = {
  async getSessions(params = {}) {
    return await api.get('/sessions', { params });
  },

  async getSession(id) {
    return await api.get(`/sessions/${id}`);
  },

  async getUpcoming() {
    return await api.get('/sessions/upcoming');
  },

  async getAvailableSlots(therapistId, date) {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    return await api.get(`/sessions/available-slots/${therapistId}`, {
      params: { date: dateStr },
    });
  },

  async createSession(data) {
    return await api.post('/sessions', data);
  },

  async updateSession(id, data) {
    return await api.put(`/sessions/${id}`, data);
  },

  async updateSessionStatus(id, data) {
    return await api.put(`/sessions/${id}/status`, data);
  },

  async cancelSession(id, cancelReason) {
    return await api.delete(`/sessions/${id}`, { data: { cancelReason } });
  },
};
