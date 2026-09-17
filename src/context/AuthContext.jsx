import { createContext, useState } from 'react';
import { loginApi } from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : null;
    } catch (e) {
      localStorage.removeItem('user');
      return null;
    }
  });

  const login = async (credentials) => {
    const data = await loginApi(credentials); 
    if (!data.token) {
      throw new Error('Respuesta de autenticación inválida');
    }
    
    const userPayload = data.user || { username: credentials.username };
    
    setToken(data.token);
    setUser(userPayload);
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userPayload));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};