import { fetchApi } from '../services/api';

export const useNotificaciones = () => ({
  getNotificaciones: () => fetchApi('/api/notificaciones'),
  createNotificacion: (data) => fetchApi('/api/notificaciones', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
});