import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const AdminContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    setDarkMode(savedDarkMode);
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      
      // Set default axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    
    setLoading(false);
  }, []);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API}/admin/login`, credentials);
      
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        
        setToken(newToken);
        setUser(userData);
        
        // Save to localStorage
        localStorage.setItem('adminToken', newToken);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        
        // Set default axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        toast.success('Erfolgreich angemeldet!');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Anmeldung fehlgeschlagen');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Anmeldung fehlgeschlagen';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    delete axios.defaults.headers.common['Authorization'];
    
    toast.info('Erfolgreich abgemeldet');
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // API helpers with authentication
  const apiCall = async (method, url, data = null) => {
    try {
      const config = {
        method,
        url: `${API}${url}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      if (data) {
        config.data = data;
      }
      
      const response = await axios(config);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        toast.error('Session abgelaufen. Bitte melden Sie sich erneut an.');
      }
      
      const message = error.response?.data?.detail || error.response?.data?.message || 'Ein Fehler ist aufgetreten';
      return { success: false, message };
    }
  };

  const value = {
    user,
    token,
    loading,
    darkMode,
    login,
    logout,
    toggleDarkMode,
    apiCall
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};