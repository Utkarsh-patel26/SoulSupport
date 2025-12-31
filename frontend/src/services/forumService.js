import api from '@/lib/api';

export const forumService = {
  async getPosts(params = {}) {
    return await api.get('/forum/posts', { params });
  },

  async getPost(id) {
    return await api.get(`/forum/posts/${id}`);
  },

  async getCategories() {
    return await api.get('/forum/categories');
  },

  async createPost(data) {
    return await api.post('/forum/posts', data);
  },

  async updatePost(id, data) {
    return await api.put(`/forum/posts/${id}`, data);
  },

  async deletePost(id) {
    return await api.delete(`/forum/posts/${id}`);
  },

  async likePost(id) {
    return await api.post(`/forum/posts/${id}/like`);
  },

  async unlikePost(id) {
    return await api.delete(`/forum/posts/${id}/like`);
  },

  async addComment(postId, data) {
    return await api.post(`/forum/posts/${postId}/comments`, data);
  },

  async deleteComment(postId, commentId) {
    return await api.delete(`/forum/posts/${postId}/comments/${commentId}`);
  },
};
