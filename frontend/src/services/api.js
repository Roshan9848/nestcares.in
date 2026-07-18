import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://nestcares-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to dynamically inject authorization tokens if they exist
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('healthcare_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 1. SETTINGS SERVICES
export const settingsAPI = {
  getSettings: async () => {
    const res = await apiClient.get('/settings');
    return res.data;
  },
  updateSettings: async (key, value) => {
    const res = await apiClient.put(`/settings/${key}`, { value });
    return res.data;
  }
};

// 2. HEALTHCARE SERVICES SERVICES
export const servicesAPI = {
  getServices: async (includeHidden = false) => {
    const res = await apiClient.get('/services', {
      params: { includeHidden: includeHidden ? 'true' : 'false' }
    });
    return res.data;
  },
  createService: async (data) => {
    const res = await apiClient.post('/services', data);
    return res.data;
  },
  updateService: async (id, data) => {
    const res = await apiClient.put(`/services/${id}`, data);
    return res.data;
  },
  deleteService: async (id) => {
    const res = await apiClient.delete(`/services/${id}`);
    return res.data;
  },
  reorderServices: async (orderedIds) => {
    const res = await apiClient.put('/services/reorder/list', { orderedIds });
    return res.data;
  }
};

// 3. BOOKINGS & TRIAGE SERVICES
export const bookingsAPI = {
  createBooking: async (formData) => {
    const res = await apiClient.post('/bookings', formData);
    return res.data;
  },
  getBookings: async (params = {}) => {
    const res = await apiClient.get('/bookings', { params });
    return res.data;
  },
  getBookingStats: async () => {
    const res = await apiClient.get('/bookings/stats');
    return res.data;
  },
  updateBookingStatus: async (id, status) => {
    const res = await apiClient.put(`/bookings/${id}/status`, { status });
    return res.data;
  },
  submitCallback: async (payload) => {
    const res = await apiClient.post('/bookings/callback', payload);
    return res.data;
  }
};

// 4. TESTIMONIALS SERVICES
export const testimonialsAPI = {
  getTestimonials: async () => {
    const res = await apiClient.get('/testimonials');
    return res.data;
  },
  createTestimonial: async (data) => {
    const res = await apiClient.post('/testimonials', data);
    return res.data;
  },
  updateTestimonial: async (id, data) => {
    const res = await apiClient.put(`/testimonials/${id}`, data);
    return res.data;
  },
  deleteTestimonial: async (id) => {
    const res = await apiClient.delete(`/testimonials/${id}`);
    return res.data;
  }
};

// 5. FAQ SERVICES
export const faqsAPI = {
  getFaqs: async () => {
    const res = await apiClient.get('/faqs');
    return res.data;
  },
  createFaq: async (data) => {
    const res = await apiClient.post('/faqs', data);
    return res.data;
  },
  updateFaq: async (id, data) => {
    const res = await apiClient.put(`/faqs/${id}`, data);
    return res.data;
  },
  deleteFaq: async (id) => {
    const res = await apiClient.delete(`/faqs/${id}`);
    return res.data;
  }
};
