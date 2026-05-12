import api from './axiosConfig';

const notificationApi = {
  /** GET /api/notifications?page=1&limit=20&unreadOnly=false */
  getAll: (params = {}) =>
    api.get('/notifications', { params }),

  /** PATCH /api/notifications/:id/read */
  markRead: (id) =>
    api.patch(`/notifications/${id}/read`),

  /** PATCH /api/notifications/read-all */
  markAllRead: () =>
    api.patch('/notifications/read-all'),

  /** DELETE /api/notifications/:id */
  remove: (id) =>
    api.delete(`/notifications/${id}`),
};

export default notificationApi;