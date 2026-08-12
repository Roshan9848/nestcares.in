import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient, bookingsAPI, servicesAPI, settingsAPI, testimonialsAPI, faqsAPI, doctorsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import InteractiveDragList from '../components/InteractiveDragList';
import { resolveImageUrl } from '../utils/url';
import { BookingTableSkeleton } from '../components/SkeletonLoader';
import { 
  LayoutDashboard, CalendarCheck, Activity, Home as HomeIcon, MessageSquare, 
  HelpCircle, MapPin, Settings as SettingsIcon, LogOut, ExternalLink, Plus, 
  Trash2, Edit, Check, X, ShieldAlert, Sparkles, Download, Printer, Save, Eye, EyeOff,
  Clock, User, FileText, Image, FileImage, UploadCloud, Loader2, Images, Menu, RefreshCw,
  UserCheck, Stethoscope, PhoneCall, Mail, Award, CheckCircle2, Search, Filter
} from 'lucide-react';

const Dashboard = ({ 
  services, refreshServices, testimonials, refreshTestimonials, 
  faqs, refreshFaqs, webSettings, refreshWebSettings, 
  contactSettings, refreshContactSettings, doctors: parentDoctors, refreshDoctors 
}) => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  // CMS Tabs: 'overview' | 'bookings' | 'services' | 'homepage' | 'testimonials' | 'faqs' | 'contact' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Stats State
  const [stats, setStats] = useState({
    total: 0, pending: 0, approved: 0, completed: 0, rejected: 0, totalServices: 0, recentBookings: []
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Bookings Management State
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingFilters, setBookingFilters] = useState({ search: '', service: 'all', status: 'all', dateStart: '', dateEnd: '' });
  const [selectedBooking, setSelectedBooking] = useState(null); // Detail modal

  // Services Tab State
  const [editingService, setEditingService] = useState(null); // null means list view, {} for new, {id} for edit
  const [serviceForm, setServiceForm] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    price: '',
    bannerImage: '',
    galleryImages: [],
    benefits: [],
    subServices: [],
    faqs: [],
    bookable: true,
    active: true,
    icon: 'Heart',
    preparationInstructions: ''
  });
  const [newSubService, setNewSubService] = useState('');
  const [editingSubIdx, setEditingSubIdx] = useState(null); // null, -1 for new, or index
  const [subForm, setSubForm] = useState({ name: '', description: '', price: '', bookable: true, active: true });
  const [newBenefit, setNewBenefit] = useState('');
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [serviceUploadLoading, setServiceUploadLoading] = useState(false);
  const [serviceFormTab, setServiceFormTab] = useState('basic');
  const [bannerUploadLoading, setBannerUploadLoading] = useState(false);

  // Homepage CMS State
  const [homepageCMS, setHomepageCMS] = useState({ 
    heroHeading: '', 
    heroDescription: '', 
    ctaText: '', 
    whyChooseUs: [], 
    howItWorks: [], 
    founders: [
      { name: '', role: '', experience: '', bio: '', img: '' },
      { name: '', role: '', experience: '', bio: '', img: '' }
    ] 
  });
  const [homepageCMSLoading, setHomepageCMSLoading] = useState(false);

  // Testimonials CMS State
  const [editingTestimonial, setEditingTestimonial] = useState(null); // {} for new, {id} for edit
  const [testimonialForm, setTestimonialForm] = useState({ name: '', text: '', designation: '', image: '' });
  const [testimonialUploadLoading, setTestimonialUploadLoading] = useState(false);

  // FAQ CMS State
  const [editingFaq, setEditingFaq] = useState(null); // {} for new, {id} for edit
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });

  // Contact CMS State
  const [contactCMS, setContactCMS] = useState({ phoneNumbers: [], emailAddress: '', whatsappNumber: '', officeAddress: '', workingHours: '', emergencyContact: '', googleMapsLink: '' });
  
  // Doctors CMS State
  const [doctorsList, setDoctorsList] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null); // null = list view, {} = new, { ...doc } = edit
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialty: '',
    qualifications: '',
    experience: '',
    regNumber: '',
    image: '',
    phone: '',
    email: '',
    bio: '',
    availability: 'Available for Home Visits',
    displayOrder: 0,
    isActive: true
  });
  const [doctorUploadLoading, setDoctorUploadLoading] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorSpecialtyFilter, setDoctorSpecialtyFilter] = useState('all');

  // Settings Tab State
  const [emailCMS, setEmailCMS] = useState({ smtpHost: '', smtpPort: '', smtpUser: '', smtpPass: '', businessEmail: '', senderName: '', templates: {} });
  const [webCMS, setWebCMS] = useState({ companyName: '', logoUrl: '', faviconUrl: '', footerContent: '', copyright: '', seoTitle: '', seoDescription: '', googleAnalyticsCode: '', primaryColor: '', secondaryColor: '', accentColor: '' });
  const [settingsUploadLoading, setSettingsUploadLoading] = useState(false);
  const [cloudinaryCMS, setCloudinaryCMS] = useState({ cloudName: '', apiKey: '', apiSecret: '' });
  const [cloudinaryLoading, setCloudinaryLoading] = useState(false);



  // Toast feedback state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Check auth
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  // Load Dashboard Stats
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await bookingsAPI.getBookingStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('[Dashboard] Error fetching stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Load Bookings list
  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);
      const { search, service, status, dateStart, dateEnd } = bookingFilters;
      const res = await bookingsAPI.getBookings({ search, service, status, dateStart, dateEnd });
      if (res.success) {
        setBookings(res.data || []);
      }
    } catch (err) {
      console.error('[Dashboard] Error fetching bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  // Initial stats trigger & live auto-sync polling
  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
      if (activeTab === 'overview') fetchStats();
      if (activeTab === 'bookings') fetchBookings();
    }, 20000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Fetch tab-specific data on change
  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    } else if (activeTab === 'doctors') {
      fetchDoctors();
    } else if (activeTab === 'homepage') {
      // Sync homepage CMS input state
      setHomepageCMS({
        heroHeading: homepageSettings?.heroHeading || '',
        heroDescription: homepageSettings?.heroDescription || '',
        ctaText: homepageSettings?.ctaText || '',
        whyChooseUs: homepageSettings?.whyChooseUs || [],
        howItWorks: homepageSettings?.howItWorks || [],
        founders: homepageSettings?.founders || [
          { name: 'Dr. Anand Verma', role: 'Founder & Chief Medical Director', experience: '22+ Years Experience', bio: 'Our mission is to bring high-acuity critical care directly to patient bedrooms in Nizamabad, ensuring families recover together.', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300' },
          { name: 'Dr. Priya Naidu', role: 'Co-founder & Chief Clinical Strategist', experience: '15+ Years Experience', bio: 'By establishing professional home nursing standards, we guarantee safety and clinical reliability for every recovery.', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300' }
        ]
      });
    } else if (activeTab === 'contact') {
      setContactCMS({
        phoneNumbers: contactSettings?.phoneNumbers || [],
        emailAddress: contactSettings?.emailAddress || '',
        whatsappNumber: contactSettings?.whatsappNumber || '',
        officeAddress: contactSettings?.officeAddress || '',
        workingHours: contactSettings?.workingHours || '',
        emergencyContact: contactSettings?.emergencyContact || '',
        googleMapsLink: contactSettings?.googleMapsLink || ''
      });
    } else if (activeTab === 'settings') {
      // Load web settings
      setWebCMS({
        companyName: webSettings?.companyName || '',
        logoUrl: webSettings?.logoUrl || '',
        faviconUrl: webSettings?.faviconUrl || '',
        footerContent: webSettings?.footerContent || '',
        copyright: webSettings?.copyright || '',
        seoTitle: webSettings?.seoTitle || '',
        seoDescription: webSettings?.seoDescription || '',
        googleAnalyticsCode: webSettings?.googleAnalyticsCode || '',
        primaryColor: webSettings?.primaryColor || '#0d9488',
        secondaryColor: webSettings?.secondaryColor || '#0f766e',
        accentColor: webSettings?.accentColor || '#3b82f6'
      });
      // Load email settings with credentials
      apiClient.get('/settings/admin/email-config').then(res => {
        if (res.data.success) {
          setEmailCMS(res.data.data);
        }
      }).catch(err => console.error('Error fetching SMTP config:', err));
      // Load Cloudinary settings with secrets
      apiClient.get('/settings/admin/cloudinary-config').then(res => {
        if (res.data.success) {
          setCloudinaryCMS(res.data.data);
        }
      }).catch(err => console.error('Error fetching Cloudinary config:', err));
    }
  }, [activeTab]);

  // Handle booking filter search trigger
  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [bookingFilters]);

  // Load parent config props
  const homepageSettings = webSettings ? webSettings : null;

  // -- BOOKING OPERATIONS --
  const updateBookingStatus = async (id, status) => {
    try {
      const res = await bookingsAPI.updateBookingStatus(id, status);
      if (res.success) {
        showToast(`Booking marked as ${status.toUpperCase()}!`);
        fetchBookings();
        fetchStats();
        // Update detail modal
        if (selectedBooking && selectedBooking._id === id) {
          setSelectedBooking({ ...selectedBooking, status });
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this booking record?')) return;
    try {
      const res = await bookingsAPI.deleteBooking(id);
      if (res.success) {
        showToast('Booking deleted successfully');
        fetchBookings();
        fetchStats();
        if (selectedBooking && selectedBooking._id === id) {
          setSelectedBooking(null);
        }
      }
    } catch (err) {
      showToast('Failed to delete booking', 'error');
    }
  };

  // CSV Exporter
  const exportBookingsToCSV = () => {
    if (bookings.length === 0) {
      showToast('No booking records to export.', 'error');
      return;
    }

    const headers = ['Booking ID', 'Patient Name', 'Mobile', 'Email', 'Service', 'Date', 'Time Slot', 'Address', 'Status', 'Submitted At'];
    const rows = bookings.map(b => [
      b._id,
      `"${b.name}"`,
      b.mobile,
      b.email,
      `"${b.serviceName}"`,
      b.preferredDate,
      `"${b.preferredTime}"`,
      `"${b.address.replace(/"/g, '""')}"`,
      b.status.toUpperCase(),
      b.createdAt
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Bookings_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Bookings report exported successfully!');
  };

  // Trigger browser printing for PDF formatting
  const printBookingDetail = () => {
    window.print();
  };



  // -- IMAGE UPLOAD CONTROLLER HELPERS --
  const handleImageFileChange = async (e, mode) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    if (mode === 'service_banner') setBannerUploadLoading(true);
    if (mode === 'service_gallery') setServiceUploadLoading(true);
    if (mode === 'testimonial') setTestimonialUploadLoading(true);
    if (mode === 'doctor') setDoctorUploadLoading(true);
    if (mode === 'settings' || mode === 'settings_favicon') setSettingsUploadLoading(true);

    try {
      const res = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        showToast('Image uploaded successfully!');
        const uploadedUrl = res.data.url;
        
        if (mode === 'service_banner') {
          setServiceForm(prev => ({ ...prev, bannerImage: uploadedUrl }));
        } else if (mode === 'service_gallery') {
          setServiceForm(prev => ({ ...prev, galleryImages: [...prev.galleryImages, uploadedUrl] }));
        } else if (mode === 'testimonial') {
          setTestimonialForm(prev => ({ ...prev, image: uploadedUrl }));
        } else if (mode === 'doctor') {
          setDoctorForm(prev => ({ ...prev, image: uploadedUrl }));
        } else if (mode === 'settings') {
          setWebCMS(prev => ({ ...prev, logoUrl: uploadedUrl }));
        } else if (mode === 'settings_favicon') {
          setWebCMS(prev => ({ ...prev, faviconUrl: uploadedUrl }));
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Image upload failed', 'error');
    } finally {
      if (mode === 'service_banner') setBannerUploadLoading(false);
      if (mode === 'service_gallery') setServiceUploadLoading(false);
      if (mode === 'testimonial') setTestimonialUploadLoading(false);
      if (mode === 'doctor') setDoctorUploadLoading(false);
      if (mode === 'settings' || mode === 'settings_favicon') setSettingsUploadLoading(false);
    }
  };

  // -- SERVICE OPERATIONS --
  const openServiceForm = (service = null) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        title: service.title,
        shortDescription: service.shortDescription,
        fullDescription: service.fullDescription,
        price: service.price,
        bannerImage: service.bannerImage || '',
        galleryImages: service.galleryImages || [],
        benefits: service.benefits || [],
        subServices: service.subServices || [],
        faqs: service.faqs || [],
        bookable: service.bookable !== undefined ? service.bookable : true,
        active: service.active !== undefined ? service.active : true,
        icon: service.icon || 'Heart',
        preparationInstructions: service.preparationInstructions || ''
      });
    } else {
      setEditingService({});
      setServiceForm({
        title: '',
        shortDescription: '',
        fullDescription: '',
        price: '',
        bannerImage: '',
        galleryImages: [],
        benefits: [],
        subServices: [],
        faqs: [],
        bookable: true,
        active: true,
        icon: 'Heart',
        preparationInstructions: ''
      });
    }
    setNewSubService('');
    setNewBenefit('');
    setNewFaq({ question: '', answer: '' });
    setServiceFormTab('basic');
  };

  // Sub-Services CMS management helpers
  const handleOpenSubForm = (idx = -1) => {
    setEditingSubIdx(idx);
    if (idx === -1) {
      setSubForm({ name: '', description: '', price: '', bookable: true, active: true });
    } else {
      const target = serviceForm.subServices[idx];
      setSubForm({
        name: target.name || '',
        description: target.description || '',
        price: target.price || '',
        bookable: target.bookable !== undefined ? target.bookable : true,
        active: target.active !== undefined ? target.active : true
      });
    }
  };

  const handleSaveSubForm = () => {
    if (!subForm.name.trim()) {
      showToast('Sub-service name is required!', 'error');
      return;
    }
    const updated = [...serviceForm.subServices];
    const newSubObj = {
      name: subForm.name.trim(),
      description: subForm.description.trim(),
      price: Number(subForm.price) || 0,
      bookable: subForm.bookable,
      active: subForm.active,
      displayOrder: editingSubIdx === -1 ? updated.length : updated[editingSubIdx].displayOrder || 0
    };

    if (editingSubIdx === -1) {
      updated.push(newSubObj);
    } else {
      updated[editingSubIdx] = { ...updated[editingSubIdx], ...newSubObj };
    }

    setServiceForm(prev => ({ ...prev, subServices: updated }));
    setEditingSubIdx(null);
    showToast('Sub-service updated in draft!');
  };

  const handleDeleteSub = (idx) => {
    if (!window.confirm('Delete this sub-service specification?')) return;
    const updated = serviceForm.subServices.filter((_, i) => i !== idx);
    setServiceForm(prev => ({ ...prev, subServices: updated }));
    showToast('Sub-service removed from draft.');
  };

  const handleReorderSub = (idx, direction) => {
    const updated = [...serviceForm.subServices];
    if (direction === 'up' && idx > 0) {
      const temp = updated[idx];
      updated[idx] = updated[idx - 1];
      updated[idx - 1] = temp;
    } else if (direction === 'down' && idx < updated.length - 1) {
      const temp = updated[idx];
      updated[idx] = updated[idx + 1];
      updated[idx + 1] = temp;
    }
    setServiceForm(prev => ({ ...prev, subServices: updated }));
  };

  const saveService = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingService._id) {
        // Edit Mode
        res = await apiClient.put(`/services/${editingService._id}`, serviceForm);
      } else {
        // Create Mode
        res = await apiClient.post('/services', serviceForm);
      }

      if (res.data.success) {
        showToast('Service saved successfully!');
        setEditingService(null);
        refreshServices();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save service', 'error');
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service speciality?')) return;
    try {
      const res = await apiClient.delete(`/services/${id}`);
      if (res.data.success) {
        showToast('Service deleted successfully.');
        refreshServices();
      }
    } catch (err) {
      showToast('Failed to delete service.', 'error');
    }
  };

  const toggleServiceVisibility = async (service) => {
    try {
      const res = await apiClient.put(`/services/${service._id}`, { active: !service.active });
      if (res.data.success) {
        showToast(`Service is now ${!service.active ? 'VISIBLE' : 'HIDDEN'}`);
        refreshServices();
      }
    } catch (err) {
      showToast('Failed to change visibility.', 'error');
    }
  };

  // Drag-and-Drop ordering list handler
  const handleServiceReorder = async (reorderedList) => {
    const orderedIds = reorderedList.map(s => s._id);
    try {
      const res = await apiClient.put('/services/reorder/list', { orderedIds });
      if (res.data.success) {
        showToast('Catalog order saved!');
        refreshServices();
      }
    } catch (err) {
      showToast('Failed to update order.', 'error');
    }
  };

  // -- HOMEPAGE CMS OPERATIONS --
  const saveHomepageCMS = async (e) => {
    e.preventDefault();
    setHomepageCMSLoading(true);
    try {
      const res = await apiClient.put('/settings/homepage', { value: homepageCMS });
      if (res.data.success) {
        showToast('Homepage contents saved!');
        refreshWebSettings();
      }
    } catch (err) {
      showToast('Failed to save homepage configurations.', 'error');
    } finally {
      setHomepageCMSLoading(false);
    }
  };

  // -- TESTIMONIAL OPERATIONS --
  const openTestimonialForm = (test = null) => {
    if (test) {
      setEditingTestimonial(test);
      setTestimonialForm({ name: test.name, text: test.text, designation: test.designation, image: test.image || '' });
    } else {
      setEditingTestimonial({});
      setTestimonialForm({ name: '', text: '', designation: '', image: '' });
    }
  };

  const saveTestimonial = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingTestimonial._id) {
        res = await apiClient.put(`/testimonials/${editingTestimonial._id}`, testimonialForm);
      } else {
        res = await apiClient.post('/testimonials', testimonialForm);
      }

      if (res.data.success) {
        showToast('Testimonial saved successfully!');
        setEditingTestimonial(null);
        refreshTestimonials();
      }
    } catch (err) {
      showToast('Failed to save testimonial.', 'error');
    }
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm('Remove testimonial?')) return;
    try {
      const res = await apiClient.delete(`/testimonials/${id}`);
      if (res.data.success) {
        showToast('Testimonial removed.');
        refreshTestimonials();
      }
    } catch (err) {
      showToast('Failed to remove testimonial.', 'error');
    }
  };

  // -- FAQ OPERATIONS --
  const openFaqForm = (faq = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFaqForm({ question: faq.question, answer: faq.answer });
    } else {
      setEditingFaq({});
      setFaqForm({ question: '', answer: '' });
    }
  };

  const saveFaq = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingFaq._id) {
        res = await apiClient.put(`/faqs/${editingFaq._id}`, faqForm);
      } else {
        res = await apiClient.post('/faqs', faqForm);
      }

      if (res.data.success) {
        showToast('FAQ saved successfully!');
        setEditingFaq(null);
        refreshFaqs();
      }
    } catch (err) {
      showToast('Failed to save FAQ.', 'error');
    }
  };

  const deleteFaq = async (id) => {
    if (!window.confirm('Delete FAQ?')) return;
    try {
      const res = await apiClient.delete(`/faqs/${id}`);
      if (res.data.success) {
        showToast('FAQ deleted.');
        refreshFaqs();
      }
    } catch (err) {
      showToast('Failed to delete FAQ.', 'error');
    }
  };

  // -- DOCTORS & CLINICIANS OPERATIONS --
  const fetchDoctors = async () => {
    try {
      setDoctorsLoading(true);
      const res = await doctorsAPI.getAll();
      if (res.success) {
        setDoctorsList(res.data || []);
      }
    } catch (err) {
      console.error('[Dashboard] Error fetching doctors:', err);
      if (parentDoctors && parentDoctors.length > 0) {
        setDoctorsList(parentDoctors);
      }
    } finally {
      setDoctorsLoading(false);
    }
  };

  const openDoctorForm = (doc = null) => {
    if (doc) {
      setEditingDoctor(doc);
      setDoctorForm({
        name: doc.name || '',
        specialty: doc.specialty || '',
        qualifications: doc.qualifications || 'MBBS',
        experience: doc.experience || '5+ Years',
        regNumber: doc.regNumber || '',
        image: doc.image || '',
        phone: doc.phone || '',
        email: doc.email || '',
        bio: doc.bio || '',
        availability: doc.availability || 'Available for Home Visits',
        displayOrder: doc.displayOrder !== undefined ? doc.displayOrder : 0,
        isActive: doc.isActive !== undefined ? doc.isActive : true
      });
    } else {
      setEditingDoctor({});
      setDoctorForm({
        name: '',
        specialty: 'General Physician & Home Care',
        qualifications: 'MBBS, MD',
        experience: '8+ Years Experience',
        regNumber: '',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
        phone: '+91 92488 49388',
        email: '',
        bio: '',
        availability: 'Available for Home Visits',
        displayOrder: (doctorsList?.length || 0) + 1,
        isActive: true
      });
    }
  };

  const saveDoctor = async (e) => {
    e.preventDefault();
    if (!doctorForm.name.trim()) {
      showToast('Doctor name is required!', 'error');
      return;
    }
    if (!doctorForm.specialty.trim()) {
      showToast('Specialty is required!', 'error');
      return;
    }

    try {
      let res;
      if (editingDoctor._id) {
        res = await doctorsAPI.update(editingDoctor._id, doctorForm);
      } else {
        res = await doctorsAPI.create(doctorForm);
      }

      if (res.success) {
        showToast(editingDoctor._id ? 'Doctor profile & image updated successfully!' : 'Doctor profile created successfully!');
        setEditingDoctor(null);
        fetchDoctors();
        if (refreshDoctors) refreshDoctors();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save doctor profile.', 'error');
    }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this doctor profile?')) return;
    try {
      const res = await doctorsAPI.delete(id);
      if (res.success) {
        showToast('Doctor profile removed.');
        fetchDoctors();
        if (refreshDoctors) refreshDoctors();
      }
    } catch (err) {
      showToast('Failed to delete doctor profile.', 'error');
    }
  };

  const toggleDoctorStatus = async (doc) => {
    try {
      const res = await doctorsAPI.update(doc._id, { isActive: !doc.isActive });
      if (res.success) {
        showToast(`Doctor marked as ${!doc.isActive ? 'Active' : 'Inactive'}!`);
        fetchDoctors();
        if (refreshDoctors) refreshDoctors();
      }
    } catch (err) {
      showToast('Failed to update doctor status', 'error');
    }
  };

  // -- CONTACT SETTINGS OPERATIONS --
  const saveContactCMS = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.put('/settings/contact', { value: contactCMS });
      if (res.data.success) {
        showToast('Contact channels saved!');
        refreshContactSettings();
      }
    } catch (err) {
      showToast('Failed to save contact options.', 'error');
    }
  };

  // -- SETTINGS OPERATIONS (SMTP/SEO/GENERAL) --
  const saveSettingsCMS = async (e) => {
    e.preventDefault();
    try {
      setCloudinaryLoading(true);
      // 1. Save general settings
      const resWeb = await apiClient.put('/settings/web', { value: webCMS });
      
      // 2. Save SMTP settings
      const resMail = await apiClient.put('/settings/email', { value: emailCMS });

      // 3. Save Cloudinary settings
      const resCloud = await apiClient.put('/settings/cloudinary', { value: cloudinaryCMS });

      if (resWeb.data.success && resMail.data.success && resCloud.data.success) {
        showToast('All global settings saved successfully!');
        refreshWebSettings();
      }
    } catch (err) {
      showToast('Failed to save settings configurations.', 'error');
    } finally {
      setCloudinaryLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex text-slate-800 font-sans relative overflow-x-hidden">
      
      {/* MOBILE BACKDROP OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* CMS SIDEBAR */}
      <aside className={`w-64 bg-gradient-to-b from-[#0a0f1d] via-[#0f172a] to-[#0a0f1d] text-slate-350 flex flex-col shrink-0 no-print border-r border-slate-800/60 shadow-2xl fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xs font-black text-white uppercase tracking-wider leading-none">Nest Cares</h2>
              <p className="text-[8px] text-slate-500 font-extrabold uppercase mt-1 leading-none">Portal CMS Panel</p>
            </div>
          </div>
          {/* Close button on mobile sidebar header */}
          <button 
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 text-slate-500 hover:text-white rounded lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {[
            { id: 'overview', name: 'Stats Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'bookings', name: 'Booking Manager', icon: <CalendarCheck className="w-4 h-4" /> },
            { id: 'doctors', name: 'Doctors & Clinicians', icon: <UserCheck className="w-4 h-4" /> },
            { id: 'services', name: 'Service Catalog', icon: <Activity className="w-4 h-4" /> },
            { id: 'homepage', name: 'Homepage Content', icon: <HomeIcon className="w-4 h-4" /> },
            { id: 'testimonials', name: 'Testimonials', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'faqs', name: 'FAQ Collapsibles', icon: <HelpCircle className="w-4 h-4" /> },
            { id: 'contact', name: 'Contact Options', icon: <MapPin className="w-4 h-4" /> },
            { id: 'settings', name: 'Web & SMTP Settings', icon: <SettingsIcon className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setEditingDoctor(null);
                setEditingService(null);
                setEditingTestimonial(null);
                setEditingFaq(null);
                setIsSidebarOpen(false); // Close menu on tab click (mobile)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all duration-200 border-l-4 ${
                activeTab === tab.id
                  ? 'bg-teal-950/40 text-teal-400 border-teal-500 shadow-lg shadow-teal-500/5 font-bold'
                  : 'border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-100 hover:translate-x-1'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Profile footer */}
        <div className="p-4 border-t border-slate-800/80 flex items-center justify-between gap-3 bg-slate-950/20 text-xs shrink-0">
          <div className="overflow-hidden flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="overflow-hidden text-left">
              <div className="font-black text-slate-200 truncate leading-tight">{user?.name || 'Administrator'}</div>
              <div className="text-[9px] text-slate-500 truncate mt-0.5 leading-none">{user?.email || 'admin@carehome.com'}</div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="p-2 hover:bg-slate-800 hover:text-white rounded-lg transition-colors shrink-0 text-slate-400"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header - No print */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 shrink-0 no-print">
          <div className="flex items-center gap-3">
            {/* Hamburger Trigger button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg lg:hidden"
              title="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm sm:text-lg font-bold text-slate-800 uppercase tracking-tight truncate max-w-[150px] sm:max-w-none">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'bookings' && 'Booking Manager'}
              {activeTab === 'doctors' && 'Doctors & Clinicians Management'}
              {activeTab === 'services' && 'Service catalog'}
              {activeTab === 'homepage' && 'Homepage content CMS'}
              {activeTab === 'testimonials' && 'Patient reviews'}
              {activeTab === 'faqs' && 'FAQ Management'}
              {activeTab === 'contact' && 'Office contact channels'}
              {activeTab === 'settings' && 'Global Configurations & SMTP'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/"
              target="_blank"
              className="text-[10px] sm:text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1.5 transition-all"
            >
              <span>Preview Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Scrollable Work Pane */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 text-left">
              {statsLoading ? (
                <div className="text-slate-500">Calculating statistics...</div>
              ) : (
                <>
                  {/* Grid Cards Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6 rounded-2xl border border-teal-800/30 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-between text-white relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all"></div>
                      <div className="relative z-10">
                        <div className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Total Bookings</div>
                        <div className="text-3xl font-black text-white mt-1">{stats.total}</div>
                      </div>
                      <div className="p-3 bg-white/10 text-teal-400 rounded-xl relative z-10 border border-white/10">
                        <CalendarCheck className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 p-6 rounded-2xl border border-amber-900/30 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-between text-white relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
                      <div className="relative z-10">
                        <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Pending Bookings</div>
                        <div className="text-3xl font-black text-white mt-1">{stats.pending}</div>
                      </div>
                      <div className="p-3 bg-white/10 text-amber-400 rounded-xl relative z-10 border border-white/10">
                        <Clock className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-6 rounded-2xl border border-emerald-900/30 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-between text-white relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
                      <div className="relative z-10">
                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Completed Bookings</div>
                        <div className="text-3xl font-black text-white mt-1">{stats.completed}</div>
                      </div>
                      <div className="p-3 bg-white/10 text-emerald-400 rounded-xl relative z-10 border border-white/10">
                        <Check className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-indigo-900/30 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-between text-white relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
                      <div className="relative z-10">
                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Specialities</div>
                        <div className="text-3xl font-black text-white mt-1">{stats.totalServices}</div>
                      </div>
                      <div className="p-3 bg-white/10 text-indigo-400 rounded-xl relative z-10 border border-white/10">
                        <Activity className="w-6 h-6" />
                      </div>
                    </div>

                  </div>

                  {/* Recent Bookings lists */}
                  <div className="card-premium bg-white p-6">
                    <h3 className="text-base font-bold text-slate-900 mb-6 uppercase tracking-wider">Recent Bookings Queue</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                            <th className="px-6 py-3.5">Patient Name</th>
                            <th className="px-6 py-3.5">Requested Speciality</th>
                            <th className="px-6 py-3.5">Date & Slot</th>
                            <th className="px-6 py-3.5">Mobile</th>
                            <th className="px-6 py-3.5">Status</th>
                            <th className="px-6 py-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                          {stats.recentBookings.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center py-6 text-slate-400 text-xs">No bookings submitted yet.</td>
                            </tr>
                          ) : (
                            stats.recentBookings.map(b => (
                              <tr key={b._id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-bold text-slate-900">{b.name}</td>
                                <td className="px-6 py-4">{b.serviceName}</td>
                                <td className="px-6 py-4">
                                  <div className="font-semibold text-slate-800">{b.preferredDate}</div>
                                  <div className="text-[10px] text-slate-400">{b.preferredTime}</div>
                                </td>
                                <td className="px-6 py-4">{b.mobile}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    b.status === 'pending' && 'bg-amber-50 text-amber-600'
                                  } ${
                                    b.status === 'approved' && 'bg-brand-blue-50 text-brand-blue'
                                  } ${
                                    b.status === 'completed' && 'bg-emerald-50 text-emerald-600'
                                  } ${
                                    b.status === 'rejected' && 'bg-red-50 text-red-600'
                                  }`}>
                                    {b.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => {
                                      setActiveTab('bookings');
                                      setSelectedBooking(b);
                                    }}
                                    className="text-xs text-brand-blue hover:underline font-semibold"
                                  >
                                    Manage
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 text-left">
              
              {/* Filter controls panel */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                {/* Search */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search Patient</label>
                  <input
                    type="text"
                    value={bookingFilters.search}
                    onChange={(e) => setBookingFilters({ ...bookingFilters, search: e.target.value })}
                    placeholder="Search name, phone, service..."
                    className="form-input text-xs py-2 px-3"
                  />
                </div>

                {/* Filter Speciality */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Speciality</label>
                  <select
                    value={bookingFilters.service}
                    onChange={(e) => setBookingFilters({ ...bookingFilters, service: e.target.value })}
                    className="form-input text-xs py-2 px-3"
                  >
                    <option value="all">All Services</option>
                    {(Array.isArray(services) ? services : []).filter(s => s).map(s => (
                      <option key={s._id} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                </div>

                {/* Filter Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</label>
                  <select
                    value={bookingFilters.status}
                    onChange={(e) => setBookingFilters({ ...bookingFilters, status: e.target.value })}
                    className="form-input text-xs py-2 px-3"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Filter Date Start */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scheduled From</label>
                  <input
                    type="date"
                    value={bookingFilters.dateStart}
                    onChange={(e) => setBookingFilters({ ...bookingFilters, dateStart: e.target.value })}
                    className="form-input text-xs py-2 px-3"
                  />
                </div>

                {/* Filter Date End */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scheduled To</label>
                  <input
                    type="date"
                    value={bookingFilters.dateEnd}
                    onChange={(e) => setBookingFilters({ ...bookingFilters, dateEnd: e.target.value })}
                    className="form-input text-xs py-2 px-3"
                  />
                </div>

              </div>

              {/* Actions panel */}
              <div className="flex justify-between items-center bg-white py-3.5 px-6 rounded-xl border border-slate-100 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Found: <strong>{bookings.length}</strong> booking requests</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={exportBookingsToCSV}
                    className="btn-secondary py-1.5 px-4 text-xs flex items-center gap-1.5 hover:border-brand-blue hover:text-brand-blue"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => setBookingFilters({ search: '', service: 'all', status: 'all', dateStart: '', dateEnd: '' })}
                    className="text-xs font-semibold hover:text-red-500 text-slate-500"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Bookings Table list */}
              {bookingsLoading ? (
                <BookingTableSkeleton />
              ) : (
                <div className="card-premium bg-white overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                          <th className="px-6 py-3.5">Patient</th>
                          <th className="px-6 py-3.5">Speciality</th>
                          <th className="px-6 py-3.5">Scheduled Date & Slot</th>
                          <th className="px-6 py-3.5">Mobile</th>
                          <th className="px-6 py-3.5">Status</th>
                          <th className="px-6 py-3.5 text-right">Quick Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        {bookings.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-10 text-slate-400 text-xs">No matching bookings found.</td>
                          </tr>
                        ) : (
                          bookings.map(b => (
                            <tr key={b._id} className="hover:bg-slate-50/50">
                              <td className="px-6 py-4 font-bold text-slate-900">
                                <div>{b.name}</div>
                                <div className="text-[10px] text-slate-400 font-normal truncate max-w-xs">{b.email}</div>
                              </td>
                              <td className="px-6 py-4 font-medium text-slate-800">{b.serviceName}</td>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-slate-800">{b.preferredDate}</div>
                                <div className="text-[10px] text-slate-400">{b.preferredTime}</div>
                              </td>
                              <td className="px-6 py-4">{b.mobile}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  b.status === 'pending' && 'bg-amber-50 text-amber-600'
                                } ${
                                  b.status === 'approved' && 'bg-brand-blue-50 text-brand-blue'
                                } ${
                                  b.status === 'completed' && 'bg-emerald-50 text-emerald-600'
                                } ${
                                  b.status === 'rejected' && 'bg-red-50 text-red-600'
                                }`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right flex items-center justify-end gap-3.5">
                                <button
                                  onClick={() => setSelectedBooking(b)}
                                  className="text-xs text-brand-blue hover:underline font-bold"
                                >
                                  Details
                                </button>
                                {b.status === 'pending' && (
                                  <>
                                    <button 
                                      onClick={() => updateBookingStatus(b._id, 'approved')}
                                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded" 
                                      title="Approve Booking"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => updateBookingStatus(b._id, 'rejected')}
                                      className="p-1 text-red-600 hover:bg-red-50 rounded" 
                                      title="Reject Booking"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                                {b.status === 'approved' && (
                                  <button
                                    onClick={() => updateBookingStatus(b._id, 'completed')}
                                    className="text-[10px] bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold px-2 py-1 rounded"
                                  >
                                    Mark Complete
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SERVICES CATALOG */}
          {activeTab === 'services' && (
            <div className="space-y-6 text-left">
              
              {/* Form View / List Toggle */}
              {editingService !== null ? (
                /* CREATE / EDIT FORM */
                <div className="card-premium bg-white p-6 sm:p-8 max-w-3xl">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
                    <h3 className="text-base font-bold text-slate-900">
                      {editingService._id ? `Edit Category: ${editingService.title}` : 'Add New Service Category'}
                    </h3>
                    <button
                      onClick={() => setEditingService(null)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                    >
                      Back to List
                    </button>
                  </div>

                  {/* SUB-TABS SELECTOR */}
                  <div className="flex border-b border-slate-100 mb-6 gap-2 no-print overflow-x-auto">
                    {[
                      { id: 'basic', name: '1. Basic Details', icon: <FileText className="w-3.5 h-3.5" /> },
                      { id: 'treatments', name: '2. Treatments List', icon: <Activity className="w-3.5 h-3.5" /> },
                      { id: 'media', name: '3. Banners & Media', icon: <Image className="w-3.5 h-3.5" /> },
                      { id: 'advisory', name: '4. Prep & FAQs', icon: <HelpCircle className="w-3.5 h-3.5" /> },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setServiceFormTab(tab.id)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all duration-200 shrink-0 ${
                          serviceFormTab === tab.id
                            ? 'border-teal-500 text-teal-600 font-bold'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.name}</span>
                      </button>
                    ))}
                  </div>

                  <form onSubmit={saveService} className="space-y-6">
                    {/* SUB-TAB: BASIC */}
                    {serviceFormTab === 'basic' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        
                        {/* Service Category Title */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase">Service Category Title *</label>
                          <input
                            type="text"
                            required
                            value={serviceForm.title}
                            onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                            className="form-input text-xs"
                            placeholder="e.g. Nursing Services"
                          />
                        </div>

                        {/* Pricing Notice */}
                        <div className="flex flex-col gap-1.5 justify-center bg-teal-50/50 border border-teal-100/50 rounded-xl p-3 text-[10px] text-teal-800 leading-relaxed font-semibold">
                          ℹ️ Base Pricing has been removed across the entire client site to align with Nizamabad local coordinate quotes.
                        </div>

                        {/* Lucide Icon Name */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase">Category Clinical Icon</label>
                          <select
                            value={serviceForm.icon}
                            onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                            className="form-input text-xs"
                          >
                            <option value="Heart">Heart (Default)</option>
                            <option value="HeartPulse">Heart Pulse (Nursing)</option>
                            <option value="Activity">Pulse Activity (ICU)</option>
                            <option value="UserCheck">Doctor Check (Consultation)</option>
                            <option value="Truck">Ambulance Truck</option>
                            <option value="FlaskConical">Laboratory Flask</option>
                            <option value="Pills">Pharmacy Pills</option>
                            <option value="Accessibility">Physiotherapy Mobility</option>
                            <option value="Apple">Dietician Nutrition</option>
                            <option value="Award">Trust Award</option>
                            <option value="ShieldAlert">Shield Emergency</option>
                          </select>
                        </div>

                        {/* Toggles */}
                        <div className="flex items-center gap-6 pt-6">
                          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={serviceForm.bookable}
                              onChange={(e) => setServiceForm({ ...serviceForm, bookable: e.target.checked })}
                              className="w-4 h-4 text-teal-705 rounded border-slate-300 focus:ring-teal-700"
                            />
                            <span>Online Bookable</span>
                          </label>

                          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={serviceForm.active}
                              onChange={(e) => setServiceForm({ ...serviceForm, active: e.target.checked })}
                              className="w-4 h-4 text-teal-705 rounded border-slate-300 focus:ring-teal-700"
                            />
                            <span>Active (Catalog Visible)</span>
                          </label>
                        </div>

                        {/* Short Description */}
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700 uppercase">Hero Card Short Subtitle *</label>
                          <input
                            type="text"
                            required
                            value={serviceForm.shortDescription}
                            onChange={(e) => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                            className="form-input text-xs"
                            placeholder="e.g. 24/7 ICU Ventilator support & monitoring..."
                          />
                        </div>

                        {/* Full Description Detail */}
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700 uppercase">Full Detail Description</label>
                          <textarea
                            value={serviceForm.fullDescription}
                            onChange={(e) => setServiceForm({ ...serviceForm, fullDescription: e.target.value })}
                            rows="4"
                            className="form-input text-xs"
                            placeholder="Details about clinical services, medical equipments provided, nurses shifts information..."
                          ></textarea>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB: TREATMENTS */}
                    {serviceFormTab === 'treatments' && (
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <label className="text-xs font-bold text-slate-800 uppercase block">Treatments & Sub-Services Catalog</label>
                          <button
                            type="button"
                            onClick={() => handleOpenSubForm()}
                            className="px-3 py-1.5 bg-teal-850 hover:bg-teal-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Treatment / Sub-Service</span>
                          </button>
                        </div>

                        {/* Inline sub-service edit panel */}
                        {editingSubIdx !== null && (
                          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4 shadow-sm text-left">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sub-Service details</div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-650 uppercase">Treatment Name *</label>
                                <input
                                  type="text"
                                  value={subForm.name}
                                  onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                                  placeholder="e.g. Wound Care Management"
                                  className="form-input text-xs py-2 px-3"
                                />
                              </div>

                              <div className="flex flex-col gap-1 justify-center bg-teal-50/50 border border-teal-105/50 rounded-xl p-2.5 text-[9px] text-teal-800 font-semibold leading-normal">
                                ℹ️ Price column has been disabled to ensure quote alignment.
                              </div>
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-slate-650 uppercase">Description / Scope (Optional)</label>
                              <textarea
                                value={subForm.description}
                                onChange={(e) => setSubForm({ ...subForm, description: e.target.value })}
                                placeholder="Details about this specific treatment..."
                                rows="2"
                                className="form-input text-xs py-2 px-3 resize-none"
                              ></textarea>
                            </div>

                            <div className="flex items-center gap-6 text-xs">
                              <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={subForm.bookable}
                                  onChange={(e) => setSubForm({ ...subForm, bookable: e.target.checked })}
                                  className="w-3.5 h-3.5 text-teal-850 rounded border-slate-300 focus:ring-teal-700"
                                />
                                <span>Online Bookable</span>
                              </label>
                              
                              <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={subForm.active}
                                  onChange={(e) => setSubForm({ ...subForm, active: e.target.checked })}
                                  className="w-3.5 h-3.5 text-teal-850 rounded border-slate-300 focus:ring-teal-700"
                                />
                                <span>Active (Visible)</span>
                              </label>
                            </div>

                            <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => setEditingSubIdx(null)}
                                className="px-3.5 py-1.5 bg-slate-105 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleSaveSubForm}
                                className="px-3.5 py-1.5 bg-teal-850 hover:bg-teal-900 text-white text-xs font-bold rounded-lg shadow-sm"
                              >
                                Save to Draft
                              </button>
                            </div>
                          </div>
                        )}

                        {/* List of sub-services */}
                        {serviceForm.subServices?.length > 0 ? (
                          <div className="space-y-2.5 font-sans">
                            {serviceForm.subServices.map((sub, idx) => (
                              <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                                <div className="grow min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-slate-800">{typeof sub === 'string' ? sub : sub.name}</span>
                                    {sub.active && (
                                      <span className="text-[9px] bg-teal-50 text-teal-800 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                        Active
                                      </span>
                                    )}
                                    {!sub.active && (
                                      <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">
                                        Hidden
                                      </span>
                                    )}
                                  </div>
                                  {sub.description && (
                                    <p className="text-[10px] text-slate-400 mt-1 truncate max-w-md">{sub.description}</p>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                                  {/* Reordering */}
                                  <button
                                    type="button"
                                    onClick={() => handleReorderSub(idx, 'up')}
                                    disabled={idx === 0}
                                    className="p-1 hover:bg-slate-50 disabled:opacity-30 rounded text-[9px]"
                                    title="Move Up"
                                  >
                                    ▲
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleReorderSub(idx, 'down')}
                                    disabled={idx === serviceForm.subServices.length - 1}
                                    className="p-1 hover:bg-slate-50 disabled:opacity-30 rounded text-[9px]"
                                    title="Move Down"
                                  >
                                    ▼
                                  </button>
                                  
                                  {/* Edit/Delete */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenSubForm(idx)}
                                    className="p-1 hover:bg-slate-100 text-slate-650 rounded ml-1"
                                    title="Edit Sub-service"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSub(idx)}
                                    className="p-1 hover:bg-slate-100 text-red-500 rounded"
                                    title="Delete Sub-service"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-slate-400 text-xs italic">No sub-services / treatments registered.</div>
                        )}
                      </div>
                    )}

                    {/* SUB-TAB: MEDIA */}
                    {serviceFormTab === 'media' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        
                        {/* Banner Image */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-slate-700 uppercase">Category Banner Image</label>
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-teal-500 hover:bg-teal-50/10 rounded-2xl p-6 cursor-pointer transition-all duration-300">
                            <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                            <span className="text-xs font-semibold text-slate-600 font-sans">Select Banner Image</span>
                            <span className="text-[10px] text-slate-400 mt-1 font-sans">Recommended size: 1200x600 (Max 5MB)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageFileChange(e, 'service_banner')}
                              className="hidden"
                            />
                          </label>
                          {bannerUploadLoading && (
                            <div className="flex items-center gap-2 text-xs text-teal-600 font-bold animate-pulse mt-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Uploading banner image...</span>
                            </div>
                          )}
                          {serviceForm.bannerImage && (
                            <div className="relative w-36 h-20 border border-slate-200 rounded-xl overflow-hidden mt-2 group">
                              <img src={resolveImageUrl(serviceForm.bannerImage)} alt="banner preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setServiceForm(prev => ({ ...prev, bannerImage: '' }))}
                                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Gallery Images */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-slate-700 uppercase">Gallery Images (Multiple)</label>
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-teal-500 hover:bg-teal-50/10 rounded-2xl p-6 cursor-pointer transition-all duration-300">
                            <Images className="w-8 h-8 text-slate-400 mb-2" />
                            <span className="text-xs font-semibold text-slate-600 font-sans">Upload Gallery Image</span>
                            <span className="text-[10px] text-slate-400 mt-1 font-sans">PNG, JPG or WEBP (Max 5MB)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageFileChange(e, 'service_gallery')}
                              className="hidden"
                            />
                          </label>
                          {serviceUploadLoading && (
                            <div className="flex items-center gap-2 text-xs text-teal-600 font-bold animate-pulse mt-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Uploading gallery image...</span>
                            </div>
                          )}
                          {serviceForm.galleryImages?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {serviceForm.galleryImages.map((img, idx) => (
                                <div key={idx} className="relative w-16 h-12 border border-slate-200 rounded-lg overflow-hidden group">
                                  <img src={resolveImageUrl(img)} alt="gallery preview" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setServiceForm(prev => ({ ...prev, galleryImages: prev.galleryImages.filter((_, i) => i !== idx) }))}
                                    className="absolute -top-1 -right-1 p-0.5 bg-red-600 text-white rounded-full hover:bg-red-700 scale-75"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                    {/* SUB-TAB: ADVISORY */}
                    {serviceFormTab === 'advisory' && (
                      <div className="space-y-6">
                        {/* Preparation instructions */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase">Preparation / Guidelines (Telugu translation syncs)</label>
                          <textarea
                            value={serviceForm.preparationInstructions}
                            onChange={(e) => setServiceForm({ ...serviceForm, preparationInstructions: e.target.value })}
                            rows="2.5"
                            className="form-input text-xs resize-none"
                            placeholder="e.g. Fasting of 10 hours required, Keep past medical reports ready..."
                          ></textarea>
                        </div>

                        {/* Array B: Benefits */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                          <label className="text-xs font-bold text-slate-800 uppercase block">Speciality Care Benefits</label>
                          
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newBenefit}
                              onChange={(e) => setNewBenefit(e.target.value)}
                              placeholder="Add care benefit (e.g. Certified Critical Care nurses)"
                              className="form-input text-xs grow py-2"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newBenefit.trim()) {
                                  setServiceForm(prev => ({ ...prev, benefits: [...prev.benefits, newBenefit.trim()] }));
                                  setNewBenefit('');
                                }
                              }}
                              className="btn-primary py-2 px-4 rounded-xl text-xs shadow-none shrink-0"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {serviceForm.benefits?.length > 0 ? (
                            <ul className="space-y-2">
                              {serviceForm.benefits.map((benefit, idx) => (
                                <li key={idx} className="bg-white border border-slate-200 text-slate-700 text-xs px-3 py-2 rounded-xl flex items-center justify-between font-semibold font-sans">
                                  <span className="truncate pr-4">{benefit}</span>
                                  <button
                                    type="button"
                                    onClick={() => setServiceForm(prev => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== idx) }))}
                                    className="text-red-500 hover:text-red-700 shrink-0"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-slate-400 text-xs italic">No clinical benefits checklist added yet.</div>
                          )}
                        </div>

                        {/* Array C: Service FAQs */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                          <label className="text-xs font-bold text-slate-800 uppercase block">Service-Specific FAQs</label>
                          
                          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                            <input
                              type="text"
                              value={newFaq.question}
                              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                              placeholder="FAQ Question"
                              className="form-input text-xs py-2"
                            />
                            <textarea
                              value={newFaq.answer}
                              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                              placeholder="FAQ Answer"
                              rows="2"
                              className="form-input text-xs py-2 resize-none"
                            ></textarea>
                            <button
                              type="button"
                              onClick={() => {
                                if (newFaq.question.trim() && newFaq.answer.trim()) {
                                  setServiceForm(prev => ({ ...prev, faqs: [...prev.faqs, { question: newFaq.question.trim(), answer: newFaq.answer.trim() }] }));
                                  setNewFaq({ question: '', answer: '' });
                                }
                              }}
                              className="btn-primary py-2 px-4 rounded-lg text-xs shadow-none w-full"
                            >
                              <span>Add FAQ Pair</span>
                            </button>
                          </div>

                          {serviceForm.faqs?.length > 0 ? (
                            <div className="space-y-3.5 font-sans">
                              {serviceForm.faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 relative text-left flex justify-between gap-4">
                                  <div className="text-xs">
                                    <div className="font-bold text-slate-900 font-sans">Q: {faq.question}</div>
                                    <div className="text-slate-550 mt-1 font-sans">A: {faq.answer}</div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setServiceForm(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== idx) }))}
                                    className="text-red-500 hover:text-red-700 shrink-0"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-slate-400 text-xs italic">No service-specific FAQs added yet.</div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 border-t border-slate-100 pt-5 justify-end">
                      <button
                        type="button"
                        onClick={() => setEditingService(null)}
                        className="btn-secondary py-2.5 px-6 rounded-xl font-semibold text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary py-2.5 px-6 rounded-xl font-bold text-xs"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Speciality</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* SERVICES LIST VIEW */
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white py-3.5 px-6 rounded-xl border border-slate-100 shadow-sm">
                    <span className="text-xs text-slate-500 font-medium">💡 Drag rows using the left grip icon to reorder service tabs on the website.</span>
                    <button
                      onClick={() => openServiceForm()}
                      className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 shadow-none rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Speciality Category</span>
                    </button>
                  </div>

                  <InteractiveDragList
                    items={services}
                    onReorder={handleServiceReorder}
                    renderItem={(item) => (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4 text-left">
                          {item.galleryImages?.length > 0 && (
                            <div className="w-14 h-10 border border-slate-100 rounded-lg overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                              <img
                                src={resolveImageUrl(item.galleryImages[0])}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                            <p className="text-[10px] text-slate-400">
                              Total Treatments: {item.subServices?.length || 0} items configured
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Hide / Show Toggle button */}
                          <button
                            onClick={() => toggleServiceVisibility(item)}
                            className={`p-1.5 rounded hover:bg-slate-100 ${
                              item.active ? 'text-brand-blue' : 'text-slate-400'
                            }`}
                            title={item.active ? 'Category Published' : 'Category Hidden'}
                          >
                            {item.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          
                          <button
                            onClick={() => openServiceForm(item)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                            title="Edit Service"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteService(item._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB: DOCTORS & CLINICIANS CMS */}
          {activeTab === 'doctors' && (
            <div className="space-y-6 text-left">
              
              {/* Header & Stats Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-teal-800/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-mono font-bold uppercase tracking-widest">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                    Verified Medical Staff Registry
                  </div>
                  <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
                    Doctors & Clinicians Directory
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                    Add new doctors, edit medical qualifications, change profile images, and configure home visit availability across Nizamabad.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
                  <button
                    type="button"
                    onClick={fetchDoctors}
                    disabled={doctorsLoading}
                    className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-bold rounded-xl border border-slate-700/60 flex items-center gap-2 transition-all shadow-xs"
                    title="Refresh Doctors List"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${doctorsLoading ? 'animate-spin text-teal-400' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openDoctorForm(null)}
                    className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold rounded-xl flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-teal-500/20 uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
                    <span>Add New Doctor</span>
                  </button>
                </div>

                {/* Subtle Background Lighting */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
              </div>

              {/* Filter & Search Bar + Quick Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Search & Specialty Filter */}
                <div className="lg:col-span-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={doctorSearch}
                      onChange={(e) => setDoctorSearch(e.target.value)}
                      placeholder="Search doctor by name, qualification, or council reg..."
                      className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      value={doctorSpecialtyFilter}
                      onChange={(e) => setDoctorSpecialtyFilter(e.target.value)}
                      className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-teal-500"
                    >
                      <option value="all">All Specialities</option>
                      <option value="physician">General Physician</option>
                      <option value="critical">Critical Care / ICU</option>
                      <option value="cardio">Cardiology</option>
                      <option value="physio">Physiotherapy</option>
                      <option value="nursing">Home Nursing</option>
                      <option value="pulmono">Pulmonology</option>
                    </select>
                  </div>
                </div>

                {/* Mini Stats Badges */}
                <div className="lg:col-span-4 grid grid-cols-2 gap-3">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Clinicians</div>
                      <div className="text-xl font-extrabold text-slate-900">{doctorsList?.length || 0}</div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                      <UserCheck className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active On-Duty</div>
                      <div className="text-xl font-extrabold text-emerald-600">
                        {doctorsList?.filter(d => d.isActive !== false).length || 0}
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctors Directory Cards Grid */}
              {doctorsLoading && doctorsList.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Loading Doctors & Clinicians...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {doctorsList
                    .filter(doc => {
                      const query = doctorSearch.toLowerCase().trim();
                      const matchesSearch = !query || 
                        doc.name?.toLowerCase().includes(query) ||
                        doc.specialty?.toLowerCase().includes(query) ||
                        doc.qualifications?.toLowerCase().includes(query) ||
                        doc.regNumber?.toLowerCase().includes(query);
                      const matchesFilter = doctorSpecialtyFilter === 'all' || 
                        doc.specialty?.toLowerCase().includes(doctorSpecialtyFilter.toLowerCase());
                      return matchesSearch && matchesFilter;
                    })
                    .map((doc) => (
                      <div 
                        key={doc._id || doc.name}
                        className={`bg-white rounded-3xl border transition-all duration-300 p-5 flex flex-col justify-between shadow-2xs hover:shadow-lg relative group ${
                          doc.isActive === false ? 'border-slate-200/60 opacity-60 bg-slate-50/50' : 'border-slate-200 hover:border-teal-400/80'
                        }`}
                      >
                        {/* Card Top: Photo + Key Info */}
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            {/* Doctor Avatar / Image with Quick Hover Edit */}
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-inner group/photo">
                              <img
                                src={resolveImageUrl(doc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400')}
                                alt={doc.name}
                                className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400';
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => openDoctorForm(doc)}
                                className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold"
                                title="Change Photo"
                              >
                                Edit Image
                              </button>
                            </div>

                            {/* Doctor Name, Reg, and Status */}
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  doc.isActive !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-600'
                                }`}>
                                  {doc.isActive !== false ? 'Active On-Duty' : 'Inactive / Hidden'}
                                </span>
                                
                                {doc.regNumber && (
                                  <span className="text-[9px] font-mono text-slate-400 uppercase">
                                    {doc.regNumber}
                                  </span>
                                )}
                              </div>

                              <h3 className="text-sm font-extrabold text-slate-900 leading-snug truncate">
                                {doc.name}
                              </h3>

                              <p className="text-[11px] font-bold text-teal-800 line-clamp-1">
                                {doc.specialty}
                              </p>

                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                <span className="font-semibold">{doc.qualifications || 'MBBS'}</span>
                                <span>•</span>
                                <span>{doc.experience || '5+ Yrs Exp'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Availability Badge */}
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[10px] text-slate-600 space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-slate-700 uppercase tracking-wide">
                              <Clock className="w-3 h-3 text-teal-700" />
                              <span>Home Availability</span>
                            </div>
                            <p className="line-clamp-1 text-slate-500 font-medium">
                              {doc.availability || 'Available for daily home visits'}
                            </p>
                          </div>

                          {/* Clinical Bio */}
                          {doc.bio && (
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed italic">
                              "{doc.bio}"
                            </p>
                          )}
                        </div>

                        {/* Card Bottom: Contact Quick Link & Actions */}
                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {doc.phone && (
                              <a
                                href={`tel:${doc.phone.replace(/\s+/g, '')}`}
                                className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors"
                                title={`Call: ${doc.phone}`}
                              >
                                <PhoneCall className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {doc.email && (
                              <a
                                href={`mailto:${doc.email}`}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                title={`Email: ${doc.email}`}
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Toggle active button */}
                            <button
                              type="button"
                              onClick={() => toggleDoctorStatus(doc)}
                              className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                                doc.isActive !== false
                                  ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
                                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                              }`}
                              title={doc.isActive !== false ? 'Deactivate Doctor' : 'Activate Doctor'}
                            >
                              {doc.isActive !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>

                            {/* Edit Doctor Details & Image button */}
                            <button
                              type="button"
                              onClick={() => openDoctorForm(doc)}
                              className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold flex items-center gap-1 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            {/* Delete Doctor button */}
                            <button
                              type="button"
                              onClick={() => deleteDoctor(doc._id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                              title="Delete Doctor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                </div>
              )}

              {/* Add / Edit Doctor Full Modal Form */}
              {editingDoctor !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto no-print">
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-left my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 border border-teal-100 flex items-center justify-center font-bold">
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                            {editingDoctor._id ? `Edit Doctor: ${editingDoctor.name}` : 'Register New Doctor / Clinician'}
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Manage physician credentials, practice specialty, and profile photo.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingDoctor(null)}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={saveDoctor} className="space-y-5">
                      
                      {/* Section 1: Doctor Profile Image Upload & Preview */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                          <Image className="w-4 h-4 text-teal-700" />
                          <span>Doctor Profile Image</span>
                        </label>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {/* Image Live Preview */}
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white border-2 border-slate-200 shadow-xs shrink-0 flex items-center justify-center">
                            {doctorForm.image ? (
                              <img
                                src={resolveImageUrl(doctorForm.image)}
                                alt="Doctor preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400';
                                }}
                              />
                            ) : (
                              <User className="w-8 h-8 text-slate-300" />
                            )}
                          </div>

                          {/* Image Actions: Upload File & URL Input */}
                          <div className="flex-1 w-full space-y-2.5">
                            <div className="flex items-center gap-2">
                              <label className="flex-1 flex items-center justify-center gap-2 border border-teal-200 bg-teal-50/60 hover:bg-teal-100/60 text-teal-900 rounded-xl px-4 py-2.5 cursor-pointer transition-all text-xs font-bold">
                                <UploadCloud className="w-4 h-4 text-teal-700" />
                                <span>Upload Photo from Device</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageFileChange(e, 'doctor')}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            {doctorUploadLoading && (
                              <div className="flex items-center gap-2 text-[10px] text-teal-700 font-bold animate-pulse">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Uploading profile image...</span>
                              </div>
                            )}

                            {/* Or Direct Image URL input */}
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Or Paste Direct Image URL:</span>
                              <input
                                type="text"
                                value={doctorForm.image}
                                onChange={(e) => setDoctorForm({ ...doctorForm, image: e.target.value })}
                                placeholder="https://images.unsplash.com/... or /uploads/..."
                                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono text-slate-700 focus:outline-none focus:border-teal-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Basic Doctor Credentials */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase">
                            Doctor Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={doctorForm.name}
                            onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                            placeholder="e.g. Dr. K. Srinivas Reddy"
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-semibold"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase">
                            Speciality / Medical Designation *
                          </label>
                          <input
                            type="text"
                            required
                            value={doctorForm.specialty}
                            onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                            placeholder="e.g. Senior General Physician & Geriatrician"
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-semibold"
                          />
                        </div>
                      </div>

                      {/* Section 3: Qualifications, Experience, Council Reg */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase">
                            Qualifications & Degrees
                          </label>
                          <input
                            type="text"
                            value={doctorForm.qualifications}
                            onChange={(e) => setDoctorForm({ ...doctorForm, qualifications: e.target.value })}
                            placeholder="e.g. MBBS, MD (Gen Med)"
                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase">
                            Years of Experience
                          </label>
                          <input
                            type="text"
                            value={doctorForm.experience}
                            onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                            placeholder="e.g. 14+ Years Experience"
                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase">
                            Medical Reg Number (TSMC)
                          </label>
                          <input
                            type="text"
                            value={doctorForm.regNumber}
                            onChange={(e) => setDoctorForm({ ...doctorForm, regNumber: e.target.value })}
                            placeholder="e.g. TSMC/2012/4819"
                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                          />
                        </div>
                      </div>

                      {/* Section 4: Contact & Availability */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase">
                            Phone / WhatsApp Number
                          </label>
                          <input
                            type="text"
                            value={doctorForm.phone}
                            onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                            placeholder="+91 92488 49388"
                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase">
                            Doctor Email Address
                          </label>
                          <input
                            type="email"
                            value={doctorForm.email}
                            onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                            placeholder="dr.name@nestcares.in"
                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase">
                          Home Visit Availability & Working Hours
                        </label>
                        <input
                          type="text"
                          value={doctorForm.availability}
                          onChange={(e) => setDoctorForm({ ...doctorForm, availability: e.target.value })}
                          placeholder="e.g. Daily (9:00 AM - 1:00 PM & 4:00 PM - 8:00 PM) • 24/7 On-Call"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      {/* Section 5: Clinical Bio */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase">
                          Clinical Bio & Practice Scope
                        </label>
                        <textarea
                          rows="3"
                          value={doctorForm.bio}
                          onChange={(e) => setDoctorForm({ ...doctorForm, bio: e.target.value })}
                          placeholder="Brief summary of doctor's clinical background, hospital affiliations, and bedside expertise..."
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 resize-none"
                        ></textarea>
                      </div>

                      {/* Section 6: Display Settings & Toggle */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={doctorForm.isActive}
                              onChange={(e) => setDoctorForm({ ...doctorForm, isActive: e.target.checked })}
                              className="w-4 h-4 text-teal-800 rounded border-slate-300 focus:ring-teal-700"
                            />
                            <span>Active Profile (Visible in website)</span>
                          </label>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500">Display Order:</span>
                            <input
                              type="number"
                              value={doctorForm.displayOrder}
                              onChange={(e) => setDoctorForm({ ...doctorForm, displayOrder: Number(e.target.value) })}
                              className="w-16 px-2 py-1 text-xs rounded-lg border border-slate-200 text-center"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingDoctor(null)}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-teal-900 hover:bg-teal-950 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                          >
                            <Save className="w-4 h-4 text-teal-300" />
                            <span>Save Doctor Profile</span>
                          </button>
                        </div>
                      </div>

                    </form>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: HOMEPAGE CMS */}
          {activeTab === 'homepage' && (
            <div className="card-premium bg-white p-6 sm:p-8 max-w-3xl text-left">
              <form onSubmit={saveHomepageCMS} className="space-y-6">
                
                {/* Hero Heading */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Hero Banner Heading *</label>
                  <input
                    type="text"
                    required
                    value={homepageCMS.heroHeading}
                    onChange={(e) => setHomepageCMS({ ...homepageCMS, heroHeading: e.target.value })}
                    className="form-input text-xs"
                    placeholder="Enter hero banner title..."
                  />
                </div>

                {/* Hero Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Hero Description *</label>
                  <textarea
                    required
                    value={homepageCMS.heroDescription}
                    onChange={(e) => setHomepageCMS({ ...homepageCMS, heroDescription: e.target.value })}
                    rows="3"
                    className="form-input text-xs resize-none"
                    placeholder="Describe core home clinical capabilities..."
                  ></textarea>
                </div>

                {/* CTA text */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">CTA Button Text *</label>
                  <input
                    type="text"
                    required
                    value={homepageCMS.ctaText}
                    onChange={(e) => setHomepageCMS({ ...homepageCMS, ctaText: e.target.value })}
                    className="form-input text-xs"
                    placeholder="e.g. Book a Service"
                  />
                </div>

                {/* Founders Spotlight Section */}
                <div className="border-t border-slate-100 pt-6 space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Founders Spotlight CMS</h3>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Customize Founder and Co-founder spotlights on the About Us page dynamically.</p>
                  </div>
                  
                  {homepageCMS.founders && homepageCMS.founders.map((founder, idx) => (
                    <div key={idx} className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-4">
                      <h4 className="text-[10px] font-black text-teal-850 uppercase tracking-widest">
                        Clinician Spotlight #{idx + 1} ({idx === 0 ? 'Founder' : 'Co-Founder'})
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1 text-left">
                          <label className="text-[10px] font-bold text-slate-700 uppercase">Full Name</label>
                          <input
                            type="text"
                            required
                            value={founder.name || ''}
                            onChange={(e) => {
                              const updated = [...homepageCMS.founders];
                              updated[idx].name = e.target.value;
                              setHomepageCMS({ ...homepageCMS, founders: updated });
                            }}
                            className="form-input text-xs py-1.5 px-3 bg-white"
                            placeholder="e.g. Dr. Anand Verma"
                          />
                        </div>

                        <div className="flex flex-col gap-1 text-left">
                          <label className="text-[10px] font-bold text-slate-700 uppercase">Role / Title</label>
                          <input
                            type="text"
                            required
                            value={founder.role || ''}
                            onChange={(e) => {
                              const updated = [...homepageCMS.founders];
                              updated[idx].role = e.target.value;
                              setHomepageCMS({ ...homepageCMS, founders: updated });
                            }}
                            className="form-input text-xs py-1.5 px-3 bg-white"
                            placeholder="Founder & Chief Medical Director"
                          />
                        </div>

                        <div className="flex flex-col gap-1 text-left">
                          <label className="text-[10px] font-bold text-slate-700 uppercase">Experience Label</label>
                          <input
                            type="text"
                            required
                            value={founder.experience || ''}
                            onChange={(e) => {
                              const updated = [...homepageCMS.founders];
                              updated[idx].experience = e.target.value;
                              setHomepageCMS({ ...homepageCMS, founders: updated });
                            }}
                            className="form-input text-xs py-1.5 px-3 bg-white"
                            placeholder="22+ Years of ICU Experience"
                          />
                        </div>

                        <div className="flex flex-col gap-1 text-left">
                          <label className="text-[10px] font-bold text-slate-700 uppercase">Clinician Photo URL</label>
                          <input
                            type="text"
                            required
                            value={founder.img || ''}
                            onChange={(e) => {
                              const updated = [...homepageCMS.founders];
                              updated[idx].img = e.target.value;
                              setHomepageCMS({ ...homepageCMS, founders: updated });
                            }}
                            className="form-input text-xs py-1.5 px-3 bg-white"
                            placeholder="Image link or /bot-avatar.png"
                          />
                        </div>

                        <div className="flex flex-col gap-1 sm:col-span-2 text-left">
                          <label className="text-[10px] font-bold text-slate-700 uppercase">Founders Statement / Bio</label>
                          <textarea
                            required
                            value={founder.bio || ''}
                            onChange={(e) => {
                              const updated = [...homepageCMS.founders];
                              updated[idx].bio = e.target.value;
                              setHomepageCMS({ ...homepageCMS, founders: updated });
                            }}
                            rows="2"
                            className="form-input text-xs py-1.5 px-3 resize-none bg-white"
                            placeholder="Statement of vision..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-6 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={homepageCMSLoading}
                    className="btn-primary py-2.5 px-6 rounded-lg text-xs font-bold flex items-center gap-2 shadow-none"
                  >
                    <Save className="w-4 h-4" />
                    <span>{homepageCMSLoading ? 'Saving content...' : 'Save Homepage Content'}</span>
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TAB 5: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6 text-left">
              {editingTestimonial !== null ? (
                /* EDIT FORM */
                <div className="card-premium bg-white p-6 sm:p-8 max-w-2xl">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
                    <h3 className="text-base font-bold text-slate-900">
                      {editingTestimonial._id ? 'Edit Testimonial' : 'Add Testimonial'}
                    </h3>
                    <button onClick={() => setEditingTestimonial(null)} className="text-xs text-slate-500 hover:text-slate-900">Cancel</button>
                  </div>

                  <form onSubmit={saveTestimonial} className="space-y-5">
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Patient Name *</label>
                      <input
                        type="text"
                        required
                        value={testimonialForm.name}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                        className="form-input text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Designation / Location *</label>
                      <input
                        type="text"
                        required
                        value={testimonialForm.designation}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, designation: e.target.value })}
                        placeholder="e.g. Son of patient, Delhi"
                        className="form-input text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Testimonial Text *</label>
                      <textarea
                        required
                        value={testimonialForm.text}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                        rows="3"
                        className="form-input text-xs resize-none"
                      ></textarea>
                    </div>

                    <button type="submit" className="btn-primary py-2 px-5 text-xs font-bold rounded-lg shadow-none">
                      Save Testimonial
                    </button>

                  </form>
                </div>
              ) : (
                /* LIST VIEW */
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button onClick={() => openTestimonialForm()} className="btn-primary py-2 px-4 text-xs rounded-lg flex items-center gap-1.5 shadow-none">
                      <Plus className="w-4 h-4" />
                      <span>Add Testimonial</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map(t => (
                      <div key={t._id} className="card-premium p-6 bg-white flex flex-col justify-between hover:border-brand-blue-100">
                        <div>
                          <p className="text-xs text-slate-500 italic mb-4 leading-relaxed">"{t.text}"</p>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-brand-blue/10 rounded-full flex items-center justify-center font-bold text-brand-blue text-[10px]">
                              {t.name[0]}
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-slate-800">{t.name}</h5>
                              <p className="text-[10px] text-slate-400">{t.designation}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                          <button onClick={() => openTestimonialForm(t)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Edit className="w-4.5 h-4.5" /></button>
                          <button onClick={() => deleteTestimonial(t._id)} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-4.5 h-4.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: FAQ MANAGEMENT */}
          {activeTab === 'faqs' && (
            <div className="space-y-6 text-left">
              {editingFaq !== null ? (
                /* EDIT FAQ */
                <div className="card-premium bg-white p-6 sm:p-8 max-w-xl">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
                    <h3 className="text-base font-bold text-slate-900">{editingFaq._id ? 'Edit FAQ' : 'Add FAQ'}</h3>
                    <button onClick={() => setEditingFaq(null)} className="text-xs text-slate-500 hover:text-slate-900">Cancel</button>
                  </div>
                  <form onSubmit={saveFaq} className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Question *</label>
                      <input
                        type="text"
                        required
                        value={faqForm.question}
                        onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                        className="form-input text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Answer *</label>
                      <textarea
                        required
                        value={faqForm.answer}
                        onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                        rows="4"
                        className="form-input text-xs resize-none"
                      ></textarea>
                    </div>
                    <button type="submit" className="btn-primary py-2 px-5 text-xs font-bold rounded-lg shadow-none">Save FAQ</button>
                  </form>
                </div>
              ) : (
                /* LIST VIEW */
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button onClick={() => openFaqForm()} className="btn-primary py-2 px-4 text-xs rounded-lg flex items-center gap-1.5 shadow-none">
                      <Plus className="w-4 h-4" />
                      <span>Add FAQ</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {faqs.map(f => (
                      <div key={f._id} className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between shadow-sm">
                        <div className="text-left pr-4">
                          <h4 className="text-sm font-bold text-slate-800">{f.question}</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{f.answer}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => openFaqForm(f)} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => deleteFaq(f._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: CONTACT OPTIONS */}
          {activeTab === 'contact' && (
            <div className="card-premium bg-white p-6 sm:p-8 max-w-3xl text-left">
              <form onSubmit={saveContactCMS} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Support Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={contactCMS.phoneNumbers[0] || ''}
                      onChange={(e) => setContactCMS({ ...contactCMS, phoneNumbers: [e.target.value] })}
                      className="form-input text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">WhatsApp Number *</label>
                    <input
                      type="text"
                      required
                      value={contactCMS.whatsappNumber}
                      onChange={(e) => setContactCMS({ ...contactCMS, whatsappNumber: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Office Email Address *</label>
                    <input
                      type="email"
                      required
                      value={contactCMS.emailAddress}
                      onChange={(e) => setContactCMS({ ...contactCMS, emailAddress: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">24/7 Emergency Number *</label>
                    <input
                      type="text"
                      required
                      value={contactCMS.emergencyContact}
                      onChange={(e) => setContactCMS({ ...contactCMS, emergencyContact: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Office Address *</label>
                  <textarea
                    required
                    value={contactCMS.officeAddress}
                    onChange={(e) => setContactCMS({ ...contactCMS, officeAddress: e.target.value })}
                    rows="2.5"
                    className="form-input text-xs resize-none"
                  ></textarea>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Google Maps Embed link (src URL only)</label>
                  <input
                    type="text"
                    value={contactCMS.googleMapsLink}
                    onChange={(e) => setContactCMS({ ...contactCMS, googleMapsLink: e.target.value })}
                    className="form-input text-xs"
                    placeholder="https://google.com/maps/embed/..."
                  />
                </div>

                <button type="submit" className="btn-primary py-2.5 px-6 text-xs font-bold rounded-lg shadow-none">
                  Save Contact Channels
                </button>

              </form>
            </div>
          )}

          {/* TAB 8: WEB & SMTP SETTINGS */}
          {activeTab === 'settings' && (
            <div className="card-premium bg-white p-6 sm:p-8 max-w-4xl text-left space-y-8">
              <form onSubmit={saveSettingsCMS} className="space-y-6">
                
                {/* Section A: Company settings */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 uppercase tracking-wider">Company Identity & Assets</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase">Company Name</label>
                        <input
                          type="text"
                          value={webCMS.companyName}
                          onChange={(e) => setWebCMS({ ...webCMS, companyName: e.target.value })}
                          className="form-input text-xs"
                          placeholder="e.g. Premium Health Agency"
                        />
                      </div>
                      
                      {/* Upload Favicon */}
                      <div className="flex flex-col gap-1.5 font-sans">
                        <label className="text-xs font-bold text-slate-700 uppercase">Favicon (.ico / .png)</label>
                        <label className="flex items-center justify-center gap-2 border border-slate-200 hover:border-teal-500 hover:bg-teal-50/10 rounded-xl px-4 py-2.5 cursor-pointer transition-all duration-300">
                          <FileImage className="w-4 h-4 text-slate-400 animate-pulse" />
                          <span className="text-xs font-semibold text-slate-600">Select Favicon Asset</span>
                          <input
                            type="file"
                            accept="image/x-icon,image/png,image/jpeg"
                            onChange={(e) => handleImageFileChange(e, 'settings_favicon')}
                            className="hidden"
                          />
                        </label>
                        {settingsUploadLoading && (
                          <div className="flex items-center gap-2 text-[10px] text-teal-600 font-bold animate-pulse mt-1">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading favicon...</span>
                          </div>
                        )}
                        {webCMS.faviconUrl && (
                          <div className="w-8 h-8 mt-1 border border-zinc-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                            <img
                              src={resolveImageUrl(webCMS.faviconUrl)}
                              alt="Favicon preview"
                              className="w-5 h-5 object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase font-sans">Brand Logo</label>
                      <label className="flex items-center justify-center gap-2 border border-slate-200 hover:border-teal-500 hover:bg-teal-50/10 rounded-xl px-4 py-2.5 cursor-pointer transition-all duration-300">
                        <UploadCloud className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-600">Select Logo Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileChange(e, 'settings')}
                          className="hidden"
                        />
                      </label>
                      {settingsUploadLoading && (
                        <div className="flex items-center gap-2 text-[10px] text-teal-600 font-bold animate-pulse mt-1">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading logo...</span>
                        </div>
                      )}
                      
                      {webCMS.logoUrl && (
                        <div className="w-[180px] h-[60px] mt-2 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center p-2 shadow-inner">
                          <img
                            src={resolveImageUrl(webCMS.logoUrl)}
                            alt="Logo preview"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Section B: Brand Color Customizer Palette */}
                <div className="pt-2">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 uppercase tracking-wider">Brand Color Palette</h3>
                  <p className="text-[10px] text-slate-500 mb-4 font-semibold">
                    Set your company brand colors. These will automatically apply across headings, actions, and primary borders.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    
                    {/* Primary Color */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={webCMS.primaryColor || '#0d9488'}
                          onChange={(e) => setWebCMS({ ...webCMS, primaryColor: e.target.value })}
                          className="w-10 h-10 border border-slate-200 rounded-xl cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={webCMS.primaryColor || '#0d9488'}
                          onChange={(e) => setWebCMS({ ...webCMS, primaryColor: e.target.value })}
                          className="form-input text-xs font-mono uppercase w-28"
                          placeholder="#HEX"
                        />
                      </div>
                    </div>

                    {/* Secondary Color */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Secondary Color (Hover)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={webCMS.secondaryColor || '#0f766e'}
                          onChange={(e) => setWebCMS({ ...webCMS, secondaryColor: e.target.value })}
                          className="w-10 h-10 border border-slate-200 rounded-xl cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={webCMS.secondaryColor || '#0f766e'}
                          onChange={(e) => setWebCMS({ ...webCMS, secondaryColor: e.target.value })}
                          className="form-input text-xs font-mono uppercase w-28"
                          placeholder="#HEX"
                        />
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={webCMS.accentColor || '#3b82f6'}
                          onChange={(e) => setWebCMS({ ...webCMS, accentColor: e.target.value })}
                          className="w-10 h-10 border border-slate-200 rounded-xl cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={webCMS.accentColor || '#3b82f6'}
                          onChange={(e) => setWebCMS({ ...webCMS, accentColor: e.target.value })}
                          className="form-input text-xs font-mono uppercase w-28"
                          placeholder="#HEX"
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Section C: SEO Configurations */}
                <div className="pt-2">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 uppercase tracking-wider">SEO Optimization</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">SEO Title Tag</label>
                      <input
                        type="text"
                        value={webCMS.seoTitle}
                        onChange={(e) => setWebCMS({ ...webCMS, seoTitle: e.target.value })}
                        className="form-input text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Google Analytics Tracking ID</label>
                      <input
                        type="text"
                        value={webCMS.googleAnalyticsCode}
                        onChange={(e) => setWebCMS({ ...webCMS, googleAnalyticsCode: e.target.value })}
                        placeholder="UA-XXXXXX-Y"
                        className="form-input text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 mt-4">
                    <label className="text-xs font-bold text-slate-700 uppercase">SEO Meta Description</label>
                    <textarea
                      value={webCMS.seoDescription}
                      onChange={(e) => setWebCMS({ ...webCMS, seoDescription: e.target.value })}
                      rows="2.5"
                      className="form-input text-xs resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Section D: SMTP Credentials */}
                <div className="pt-2">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 uppercase tracking-wider">SMTP Server (Nodemailer config)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">SMTP Host</label>
                      <input
                        type="text"
                        value={emailCMS.smtpHost}
                        onChange={(e) => setEmailCMS({ ...emailCMS, smtpHost: e.target.value })}
                        placeholder="smtp.mailtrap.io"
                        className="form-input text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">SMTP Port</label>
                      <input
                        type="text"
                        value={emailCMS.smtpPort}
                        onChange={(e) => setEmailCMS({ ...emailCMS, smtpPort: e.target.value })}
                        placeholder="2525"
                        className="form-input text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Sender Name</label>
                      <input
                        type="text"
                        value={emailCMS.senderName}
                        onChange={(e) => setEmailCMS({ ...emailCMS, senderName: e.target.value })}
                        placeholder="Sender Name"
                        className="form-input text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">SMTP User</label>
                      <input
                        type="text"
                        value={emailCMS.smtpUser}
                        onChange={(e) => setEmailCMS({ ...emailCMS, smtpUser: e.target.value })}
                        className="form-input text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">SMTP Password</label>
                      <input
                        type="password"
                        value={emailCMS.smtpPass}
                        onChange={(e) => setEmailCMS({ ...emailCMS, smtpPass: e.target.value })}
                        placeholder="••••••••"
                        className="form-input text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Business Email</label>
                      <input
                        type="email"
                        value={emailCMS.businessEmail}
                        onChange={(e) => setEmailCMS({ ...emailCMS, businessEmail: e.target.value })}
                        placeholder="bookings@company.com"
                        className="form-input text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Section E: Cloudinary Credentials */}
                <div className="pt-2">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 uppercase tracking-wider">Cloudinary Storage (Permanent media hosting)</h3>
                  <p className="text-[10px] text-slate-500 mb-4 font-semibold">
                    Set up cloud storage to store website logos, specialities, banners, and review avatars permanently, preventing Render server wipes.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Cloud Name</label>
                      <input
                        type="text"
                        value={cloudinaryCMS.cloudName || ''}
                        onChange={(e) => setCloudinaryCMS({ ...cloudinaryCMS, cloudName: e.target.value })}
                        placeholder="e.g. dlkfsad9a"
                        className="form-input text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">API Key</label>
                      <input
                        type="text"
                        value={cloudinaryCMS.apiKey || ''}
                        onChange={(e) => setCloudinaryCMS({ ...cloudinaryCMS, apiKey: e.target.value })}
                        placeholder="e.g. 84218942189421"
                        className="form-input text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">API Secret</label>
                      <input
                        type="password"
                        value={cloudinaryCMS.apiSecret || ''}
                        onChange={(e) => setCloudinaryCMS({ ...cloudinaryCMS, apiSecret: e.target.value })}
                        placeholder="••••••••"
                        className="form-input text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Content */}
                <div className="pt-2">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 uppercase tracking-wider">Footer Metadata</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Footer Description</label>
                      <input
                        type="text"
                        value={webCMS.footerContent}
                        onChange={(e) => setWebCMS({ ...webCMS, footerContent: e.target.value })}
                        className="form-input text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Copyright Text</label>
                      <input
                        type="text"
                        value={webCMS.copyright}
                        onChange={(e) => setWebCMS({ ...webCMS, copyright: e.target.value })}
                        className="form-input text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6 flex justify-end">
                  <button type="submit" className="btn-primary py-2.5 px-6 text-xs font-bold rounded-lg flex items-center gap-2 shadow-none">
                    <Save className="w-4 h-4" />
                    <span>Save Configuration Settings</span>
                  </button>
                </div>

              </form>
              </div>
          )}

        </div>

      </main>

      {/* DETAILS DIALOG (MODAL OVERLAY) */}
      {selectedBooking !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden text-left flex flex-col print-area">
            
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0 no-print">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase">Appointment Detail Sheet</h3>
                <p className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">
                  Reference ID: {selectedBooking.bookingId || selectedBooking._id}
                </p>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Header (Only visible on physical paper print) */}
            <div className="hidden print:block p-8 border-b border-slate-200">
              <h2 className="text-2xl font-black text-slate-900">{webSettings?.companyName || "Nest Cares Home Healthcare"}</h2>
              <p className="text-xs text-slate-500 mt-1">Hospital-grade care directly in patients' homes.</p>
              <div className="text-xs text-slate-600 mt-4">
                <strong>Booking ID:</strong> {selectedBooking.bookingId || selectedBooking._id} | <strong>Submitted:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 print-card grow">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Patient Name</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">{selectedBooking.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mobile Number</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                    <span>{selectedBooking.mobile}</span>
                    <a 
                      href={`tel:${selectedBooking.mobile}`} 
                      className="p-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded text-[10px] font-bold"
                    >
                      Call
                    </a>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</div>
                  <div className="text-xs font-semibold text-slate-600 mt-0.5 truncate">{selectedBooking.email || 'None'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Request Status</div>
                  <div className="mt-1">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      selectedBooking.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      selectedBooking.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      selectedBooking.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Requested Service & Treatment</div>
                <div className="text-sm font-bold text-teal-900 mt-0.5">
                  {selectedBooking.serviceName} {selectedBooking.subServiceName ? `(${selectedBooking.subServiceName})` : ''}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Preferred Date</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedBooking.preferredDate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Preferred Slot</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedBooking.preferredTime}</div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Service Delivery Address</div>
                <div className="text-xs text-slate-700 leading-relaxed mt-1 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedBooking.address}
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="border-t border-slate-100 pt-4 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                  <div className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">Patient Notes / Instructions</div>
                  <div className="text-xs text-slate-700 leading-relaxed mt-1">{selectedBooking.notes}</div>
                </div>
              )}

              {/* Direct WhatsApp Patient Communication */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${selectedBooking.mobile?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${selectedBooking.name}, this is Nest Cares Nizamabad regarding your booking (${selectedBooking.bookingId || selectedBooking._id}) for ${selectedBooking.serviceName}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Chat with Patient on WhatsApp</span>
                </a>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0 no-print">
              <div className="flex items-center gap-2">
                <button
                  onClick={printBookingDetail}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  onClick={() => deleteBooking(selectedBooking._id)}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 text-xs font-bold flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
              
              {/* Status Controls */}
              <div className="flex items-center gap-2">
                {selectedBooking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateBookingStatus(selectedBooking._id, 'approved')}
                      className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-xl shadow-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateBookingStatus(selectedBooking._id, 'rejected')}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
                    >
                      Reject
                    </button>
                  </>
                )}
                {selectedBooking.status === 'approved' && (
                  <button
                    onClick={() => updateBookingStatus(selectedBooking._id, 'completed')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Dynamic Toast notifications popup */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-bounce no-print">
          <div className={`px-4 py-3.5 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <Check className="w-4 h-4" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
