import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const AdminContext = createContext();
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};

export const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API}/admin/login`, credentials);
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('adminToken', newToken);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        toast.success('Giris basarili!');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Giris basarisiz');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.detail || error.response?.data?.message || 'Giris basarisiz';
      const displayMsg = typeof message === 'string' ? message :
        Array.isArray(message) ? message.map(e => e?.msg || JSON.stringify(e)).join(' ') : String(message);
      toast.error(displayMsg);
      return { success: false, message: displayMsg };
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.info('Cikis yapildi');
  }, []);

  const apiCall = useCallback(async (method, url, data = null) => {
    try {
      const config = {
        method,
        url: `${API}${url}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      if (data) config.data = data;
      const response = await axios(config);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        toast.error('Oturum suresi doldu. Tekrar giris yapin.');
      }
      const message = error.response?.data?.detail || error.response?.data?.message || 'Bir hata olustu';
      return { success: false, message };
    }
  }, [token, logout]);

  return (
    <AdminContext.Provider value={{ user, token, loading, login, logout, apiCall }}>
      {children}
    </AdminContext.Provider>
  );
};
