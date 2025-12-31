import api from '@/lib/api';

export const notificationService = {
  list() {
    return api.get('/notifications');
  },
  markRead(id) {
    return api.put(`/notifications/${id}/read`);
  },
  remove(id) {
    return api.delete(`/notifications/${id}`);
  },
};
