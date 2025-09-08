// Contexto global para manejar el estado de autenticación y usuario en la aplicación React.
import { createContext, useState, useContext } from 'react';
import { fetchApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const data = await fetchApi('/api/auth', { method: 'POST', body: JSON.stringify(credentials) });
    setUser(data.user);
    return data;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);