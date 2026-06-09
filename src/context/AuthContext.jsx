import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext();

// Create custom API client with backend url
export const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Set default auth headers for the API instance
  useEffect(() => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      
      // Fetch user profile to verify token validity
      API.get('/auth/profile')
        .then(res => {
          setUser(res.data);
        })
        .catch(err => {
          console.error('Session expired or invalid token:', err.message);
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      delete API.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed. Please check credentials.' 
      };
    }
  };

  const register = async (name, email, password, role, adminSecret) => {
    try {
      const res = await API.post('/auth/register', { 
        name, 
        email, 
        password, 
        role, 
        adminSecret 
      });
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Registration failed.' 
      };
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await API.put('/auth/profile', profileData);
      setUser(res.data);
      return { success: true, user: res.data };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Profile update failed.' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
