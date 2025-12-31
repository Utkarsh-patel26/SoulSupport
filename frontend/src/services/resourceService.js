import api from '@/lib/api';

export const resourceService = {
  list(params = {}) {
    return api.get('/resources', { params });
  },
  get(id) {
    return api.get(`/resources/${id}`);
  },
  create(data) {
    return api.post('/resources', data);
  },
  update(id, data) {
    return api.put(`/resources/${id}`, data);
  },
  remove(id) {
    return api.delete(`/resources/${id}`);
  },
};
