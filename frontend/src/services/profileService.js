import api from '@/lib/api';

export const profileService = {
  async getMyProfile() {
    const response = await api.get('/profile/me');
    return response.data;
  },

  async getPublicProfile(id) {
    const response = await api.get(`/profile/${id}`);
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/profile/update', data);
    return response.data;
  },

  async uploadPhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await api.post('/profile/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
