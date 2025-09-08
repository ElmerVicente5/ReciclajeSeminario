import { fetchApi } from '../services/api';

export const useAcopio = () => ({
  getAcopio: () => fetchApi('/api/acopio'),
  createAcopio: (data) => fetchApi('/api/acopio', { method: 'POST', body: JSON.stringify(data) }),
});