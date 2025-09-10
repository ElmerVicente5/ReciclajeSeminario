// src/hooks/useAcopio.js
import { fetchApi } from '../services/api';

// useAcopio.js
export function useAcopio() {
  const getAcopio = async () => {
    // Usa la ruta correcta según tu backend y accede a la propiedad data
    const response = await fetchApi('/api/acopio/listarAcopios');
    return response.data;
  };
  return { getAcopio };
}