import { fetchApi } from '../services/api';

export const useCalendario = () => ({
  getCalendario: () => fetchApi('/api/calendario'),
  createCalendario: (data) => fetchApi('/api/calendario', { method: 'POST', body: JSON.stringify(data) }),
});