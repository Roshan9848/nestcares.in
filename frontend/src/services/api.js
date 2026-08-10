import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://nestcares-in.onrender.com/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 20000
});

// Request interceptor to dynamically inject authorization tokens
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('healthcare_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for clear error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[API] Authorization expired or invalid token.');
    }
    return Promise.reject(error);
  }
);

// BOOKINGS API
export const bookingsAPI = {
  createBooking: async (data) => {
    const res = await apiClient.post('/bookings', data);
    return res.data;
  },
  getAllBookings: async (params = {}) => {
    const res = await apiClient.get('/bookings', { params });
    return res.data;
  },
  getBookingById: async (id) => {
    const res = await apiClient.get(`/bookings/${id}`);
    return res.data;
  },
  updateBookingStatus: async (id, status, notes = '') => {
    const res = await apiClient.put(`/bookings/${id}/status`, { status, notes });
    return res.data;
  },
  deleteBooking: async (id) => {
    const res = await apiClient.delete(`/bookings/${id}`);
    return res.data;
  },
  getStats: async () => {
    const res = await apiClient.get('/bookings/stats');
    return res.data;
  }
};

// SERVICES API
export const servicesAPI = {
  getAll: async () => {
    const res = await apiClient.get('/services');
    return res.data;
  },
  getBySlug: async (slug) => {
    const res = await apiClient.get(`/services/${slug}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/services', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/services/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/services/${id}`);
    return res.data;
  }
};

// SETTINGS API
export const settingsAPI = {
  getWebSettings: async () => {
    const res = await apiClient.get('/settings/web');
    return res.data;
  },
  updateWebSettings: async (data) => {
    const res = await apiClient.put('/settings/web', data);
    return res.data;
  },
  getContactSettings: async () => {
    const res = await apiClient.get('/settings/contact');
    return res.data;
  },
  updateContactSettings: async (data) => {
    const res = await apiClient.put('/settings/contact', data);
    return res.data;
  }
};

// TESTIMONIALS API
export const testimonialsAPI = {
  getAll: async () => {
    const res = await apiClient.get('/testimonials');
    return res.data;
  }
};

// FAQS API
export const faqsAPI = {
  getAll: async () => {
    const res = await apiClient.get('/faqs');
    return res.data;
  }
};

// DOCTORS / CLINICIANS API
export const doctorsAPI = {
  getAll: async () => {
    const res = await apiClient.get('/doctors');
    return res.data;
  }
};

export default apiClient;
