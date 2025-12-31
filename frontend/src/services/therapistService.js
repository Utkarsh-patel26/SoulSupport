import api from '@/lib/api';

export const therapistService = {
  async getTherapists(params = {}) {
    return await api.get('/therapists', { params });
  },

  async getTherapist(id) {
    return await api.get(`/therapists/${id}`);
  },

  async updateProfile(id, data) {
    return await api.put(`/therapists/${id}`, data);
  },

  async uploadPhoto(id, file) {
    const formData = new FormData();
    formData.append('photo', file);
    return await api.post(`/therapists/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async getReviews(therapistId) {
    return await api.get(`/therapists/${therapistId}/reviews`);
  },

  async checkAvailability(therapistId, date, time) {
    return await api.get(`/therapists/${therapistId}/availability`, {
      params: { date, time },
    });
  },
};
