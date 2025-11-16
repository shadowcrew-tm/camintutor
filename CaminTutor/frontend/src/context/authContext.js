import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // You'll need to install this: npm install jwt-decode
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On app load, check if token is valid
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        // Check if token is expired
        if (decodedUser.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(decodedUser.user);
        }
      } catch (err) {
        logout(); // Token is invalid
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser.user);
  };

  const register = async (email, password, role) => {
    const response = await API.post('/auth/register', { email, password, role });
    const { token } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;