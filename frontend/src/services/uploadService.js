import api from '@/lib/api';

export const uploadService = {
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
