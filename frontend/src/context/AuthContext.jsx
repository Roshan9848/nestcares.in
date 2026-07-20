import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { mockDb } from '../utils/mockDb';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Global Axios Mock Adapter Interceptors
axios.interceptors.request.use(async (config) => {
  if (window.useMockDb) {
    const url = config.url;
    const method = config.method.toUpperCase();
    const data = config.data;
    const params = config.params;

    console.log(`[Mock API Interceptor] ${method} ${url}`, data, params);

    let result = null;

    if (url === '/settings' && method === 'GET') {
      result = mockDb.getSettings();
    } else if (url.startsWith('/settings/') && method === 'PUT') {
      const key = url.split('/').pop();
      result = mockDb.saveSettingsKey(key, data.value);
    } else if (url === '/services' && method === 'GET') {
      const includeHidden = params?.includeHidden === 'true';
      result = mockDb.getServices(includeHidden);
    } else if (url === '/services' && method === 'POST') {
      result = mockDb.saveService(data);
    } else if (url.startsWith('/services/') && method === 'PUT') {
      if (url.includes('/reorder/list')) {
        result = mockDb.reorderServices(data.orderedIds);
      } else {
        const id = url.split('/').pop();
        result = mockDb.saveService({ _id: id, ...data });
      }
    } else if (url.startsWith('/services/') && method === 'DELETE') {
      const id = url.split('/').pop();
      result = mockDb.deleteService(id);
    } else if (url === '/bookings' && method === 'POST') {
      result = mockDb.createBooking(data);
    } else if (url === '/bookings' && method === 'GET') {
      result = mockDb.getBookings(params);
    } else if (url === '/bookings/stats' && method === 'GET') {
      result = mockDb.getStats();
    } else if (url.startsWith('/bookings/') && url.endsWith('/status') && method === 'PUT') {
      const id = url.split('/')[2];
      result = mockDb.updateBookingStatus(id, data.status);
    } else if (url === '/testimonials' && method === 'GET') {
      result = mockDb.getTestimonials();
    } else if (url === '/testimonials' && method === 'POST') {
      result = mockDb.saveTestimonial(data);
    } else if (url.startsWith('/testimonials/') && method === 'PUT') {
      const id = url.split('/').pop();
      result = mockDb.saveTestimonial({ _id: id, ...data });
    } else if (url.startsWith('/testimonials/') && method === 'DELETE') {
      const id = url.split('/').pop();
      result = mockDb.deleteTestimonial(id);
    } else if (url === '/faqs' && method === 'GET') {
      result = mockDb.getFaqs();
    } else if (url === '/faqs' && method === 'POST') {
      result = mockDb.saveFaq(data);
    } else if (url.startsWith('/faqs/') && method === 'PUT') {
      const id = url.split('/').pop();
      result = mockDb.saveFaq({ _id: id, ...data });
    } else if (url.startsWith('/faqs/') && method === 'DELETE') {
      const id = url.split('/').pop();
      result = mockDb.deleteFaq(id);
    } else if (url === '/settings/admin/email-config' && method === 'GET') {
      result = mockDb.getSettings().email;
    } else if (url === '/upload' && method === 'POST') {
      result = { url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400' };
    }

    return Promise.reject({
      config,
      mockResponse: {
        status: 200,
        data: { success: true, data: result },
        headers: {},
        config
      }
    });
  }
  return config;
}, (error) => Promise.reject(error));

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.mockResponse) {
      return Promise.resolve(error.mockResponse);
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'https://nestcares-in.onrender.com/api';
  axios.defaults.baseURL = API_URL;

  // Set initial token header if present
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  const verifyUser = async (authToken) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      const res = await axios.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.warn('Backend offline, verifying credentials against local mock...');
      if (authToken === 'mock_jwt_token_2026') {
        setUser({ id: 'admin_mock', name: 'Super Admin', email: 'rohith@nestcares.in', role: 'admin' });
      } else {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      verifyUser(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      if (res.data.success) {
        const newToken = res.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(res.data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return { success: true };
      }
    } catch (err) {
      // Offline fallback login validation
      if (email === 'rohith@nestcares.in' && password === 'Roya@1522') {
        const mockToken = 'mock_jwt_token_2026';
        localStorage.setItem('token', mockToken);
        setToken(mockToken);
        setUser({ id: 'admin_mock', name: 'Super Admin', email: 'rohith@nestcares.in', role: 'admin' });
        return { success: true };
      }
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please verify your credentials.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, API_URL }}>
      {children}
    </AuthContext.Provider>
  );
};
