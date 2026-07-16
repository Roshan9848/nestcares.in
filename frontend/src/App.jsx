import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { mockDb } from './utils/mockDb';
import { settingsAPI, servicesAPI, testimonialsAPI, faqsAPI } from './services/api';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import SubServiceDetail from './pages/SubServiceDetail';
import BookService from './pages/BookService';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './admin/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/ToastContext';

const AppContent = () => {
  const location = useLocation();
  const { token } = useAuth();
  
  // Public Config & Content States
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [settings, setSettings] = useState({ homepage: null, contact: null, web: null });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Parallelize all initial fetches to resolve concurrently
      const [resSettings, resServices, resTestimonials, resFaqs, resDocs] = await Promise.allSettled([
        settingsAPI.getSettings(),
        servicesAPI.getServices(!!token),
        testimonialsAPI.getTestimonials(),
        faqsAPI.getFaqs(),
        axios.get('/doctors').catch(() => null)
      ]);

      if (resSettings.status === 'fulfilled' && resSettings.value?.success) {
        setSettings(resSettings.value.data);
      }

      if (resServices.status === 'fulfilled' && resServices.value?.success) {
        setServices(resServices.value.data);
      }

      if (resTestimonials.status === 'fulfilled' && resTestimonials.value?.success) {
        setTestimonials(resTestimonials.value.data);
      }

      if (resFaqs.status === 'fulfilled' && resFaqs.value?.success) {
        setFaqs(resFaqs.value.data);
      }

      let mockDocs = mockDb.getDoctors();
      if (resDocs.status === 'fulfilled' && resDocs.value?.data?.success) {
        mockDocs = resDocs.value.data.data;
      }
      setDoctors(mockDocs);
    } catch (err) {
      console.log('[System] Initializing localized database cache...');
      window.useMockDb = true;

      // Fetch from localized local cache storage
      const mockSettings = mockDb.getSettings();
      const mockServices = mockDb.getServices(!!token);
      const mockTestimonials = mockDb.getTestimonials();
      const mockFaqs = mockDb.getFaqs();
      const mockDocs = mockDb.getDoctors();

      setSettings(mockSettings);
      setServices(mockServices);
      setTestimonials(mockTestimonials);
      setFaqs(mockFaqs);
      setDoctors(mockDocs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Update Favicon & Title from brand settings dynamically
  useEffect(() => {
    document.title = settings?.web?.seoTitle || (settings?.web?.companyName ? `${settings.web.companyName} - Home Healthcare` : "Premium Home Healthcare Services");
    
    if (settings?.web?.faviconUrl) {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = settings.web.faviconUrl.startsWith('/') ? `http://localhost:5000${settings.web.faviconUrl}` : settings.web.faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    if (settings?.web?.seoDescription) {
      const meta = document.querySelector("meta[name='description']") || document.createElement('meta');
      meta.name = 'description';
      meta.content = settings.web.seoDescription;
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, [settings]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#fdfcfb] text-slate-800 font-sans select-none relative overflow-hidden">
        {/* Soft glowing background element */}
        <div className="absolute inset-0 bg-radial-gradient(circle at center, rgba(13, 148, 136, 0.04) 0%, transparent 70%) pointer-events-none"></div>
        
        {/* Pulsing Transparent Logo */}
        <div className="relative flex flex-col items-center justify-center gap-4 z-10">
          <motion.img
            src="/logo.png"
            alt="Nest Cares.in Logo"
            className="h-16 md:h-20 w-auto object-contain"
            animate={{
              scale: [0.97, 1.03, 0.97],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="text-[10px] font-bold text-teal-800 uppercase tracking-widest animate-pulse mt-2">
            Loading Nest Cares...
          </div>
        </div>
      </div>
    );
  }

  // Check if current page is admin tab or login screen to omit public layout
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname.startsWith('/login');
  const isDoctorRoute = location.pathname.startsWith('/doctor');
  const hideLayout = isAdminRoute || isLoginRoute || isDoctorRoute;

  return (
    <>
      <style>{`
        :root {
          --brand-primary: ${settings?.web?.primaryColor || '#0d9488'};
          --brand-secondary: ${settings?.web?.secondaryColor || '#0f766e'};
          --brand-accent: ${settings?.web?.accentColor || '#3b82f6'};
        }
      `}</style>
      <ScrollToTop />
      {!hideLayout && <Navbar webSettings={settings?.web} />}
      
      <main className={hideLayout ? '' : 'min-h-[80vh] pt-[72px] md:pt-[100px] pb-16 md:pb-0'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <Home 
              homepageSettings={settings?.homepage} 
              contactSettings={settings?.contact} 
              services={services} 
              testimonials={testimonials} 
              faqs={faqs} 
            />
          } />
          <Route path="/about" element={<About doctors={doctors} founders={settings?.homepage?.founders} />} />
          <Route path="/about-us" element={<About doctors={doctors} founders={settings?.homepage?.founders} />} />
          <Route path="/services" element={<Services services={services} />} />
          <Route path="/services/:slug" element={<ServiceDetail services={services} contactSettings={settings?.contact} />} />
          <Route path="/services/:slug/:subSlug" element={<SubServiceDetail services={services} contactSettings={settings?.contact} />} />
          <Route path="/book" element={<BookService services={services} />} />
          <Route path="/contact" element={<Contact contactSettings={settings?.contact} />} />
          
          {/* Admin Authentication */}
          <Route path="/login" element={<Login />} />
          
          {/* Doctor Portal */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          
          {/* Admin Protected Dashboard Tab */}
          <Route path="/admin" element={
            <Dashboard 
              services={services}
              refreshServices={fetchData}
              testimonials={testimonials}
              refreshTestimonials={fetchData}
              faqs={faqs}
              refreshFaqs={fetchData}
              webSettings={settings?.web}
              refreshWebSettings={fetchData}
              contactSettings={settings?.contact}
              refreshContactSettings={fetchData}
            />
          } />
        </Routes>
      </main>

      {!hideLayout && <Footer webSettings={settings?.web} contactSettings={settings?.contact} />}
      {!hideLayout && <FloatingButtons contactSettings={settings?.contact} />}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
