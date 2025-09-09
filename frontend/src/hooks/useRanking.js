import { fetchApi } from '../services/api';

export const useRanking = () => ({
  getRanking: () => fetchApi('/api/ranking'),
  createRanking: (data) => fetchApi('/api/ranking', { method: 'POST', body: JSON.stringify(data) }),
});