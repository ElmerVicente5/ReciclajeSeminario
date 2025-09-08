// Configuración y funciones para realizar peticiones HTTP a la API principal del proyecto.
const API_URL = import.meta.env.VITE_API_URL;

export const fetchApi = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  return res.json();
};