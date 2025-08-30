// Servicio de autenticación: login, registro y manejo de tokens de usuario.

// Cambia esta variable a false cuando el backend esté disponible
const USE_MOCK = true;

// Mock temporal para login
const mockLogin = async ({ email, password }) => {
  // Simula validación de usuario y contraseña
  if (email === 'admin@demo.com' && password === 'Admin123!') {
    return {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        email: 'admin@demo.com',
        rol: 'admin',
      },
      success: true,
    };
  } else {
    return { success: false };
  }
};

// Llamada real a la API (descomenta y ajusta cuando el backend esté listo)
/*
import axios from 'axios';
const apiUrl = 'http://localhost:3000/api/login';
const realLogin = async ({ email, password }) => {
  const response = await axios.post(apiUrl, { email, password });
  return response.data;
};
*/

// Función principal de login (usa mock o real según USE_MOCK)
export const login = async (credenciales) => {
  console.log('Credenciales recibidas en login:', credenciales);
  if (USE_MOCK) {
    const response = await mockLogin(credenciales);
    console.log('Respuesta de mockLogin:', response);
    return response;
  } else {
    // const response = await realLogin(credenciales); // Descomenta cuando el backend esté listo
    // console.log('Respuesta de realLogin:', response);
    throw new Error('Backend no disponible');
  }
};