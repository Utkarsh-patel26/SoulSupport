import api from '@/lib/api';

export const sessionService = {
  async getSessions(params = {}) {
    const response = await api.get('/sessions', { params });
    return response.data;
  },

  async getSession(id) {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  async getUpcoming() {
    const response = await api.get('/sessions/upcoming');
    return response.data;
  },

  async getAvailableSlots(therapistId, date) {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    const response = await api.get(`/sessions/available-slots/${therapistId}`, {
      params: { date: dateStr },
    });
    return response.data;
  },

  async createSession(data) {
    const response = await api.post('/sessions', data);
    return response.data;
  },

  async updateSession(id, data) {
    const response = await api.put(`/sessions/${id}`, data);
    return response.data;
  },

  async updateSessionStatus(id, data) {
    const response = await api.put(`/sessions/${id}/status`, data);
    return response.data;
  },

  async cancelSession(id, cancelReason) {
    const response = await api.delete(`/sessions/${id}`, { data: { cancelReason } });
    return response.data;
  },
};
