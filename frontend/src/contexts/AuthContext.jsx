// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      
      if (storedUser && storedToken && tokenExpiry) {
        if (new Date().getTime() > parseInt(tokenExpiry)) {
          logout();
          return;
        } else {
          setUser(JSON.parse(storedUser));
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData, token) => {
    try {
      setUser(userData);
  
      const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000)
      localStorage.setItem('user', JSON.stringify(userData.username));
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiry', expiryTime);
  
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Hiba történt a bejelentkezéskor', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/api/users/logout');
    } catch (error) {
      console.error('Hiba történt a kijelentkezéskor', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('A useAuth csak AuthProvider-en belül használható.');
  }
  return context;
};
