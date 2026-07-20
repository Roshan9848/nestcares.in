import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Calendar, Clock, User, Phone, Mail, MapPin, 
  FileText, CheckCircle2, ArrowRight, HeartPulse
} from 'lucide-react';

import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Card from '../components/common/Card';
import PageLayout from '../components/common/PageLayout';
import { useToast } from '../components/common/ToastContext';
import { bookingsAPI } from '../services/api';
import { mockDb } from '../utils/mockDb';

const BookService = ({ services }) => {
  const location = useLocation();
  const { addToast } = useToast();
  
  const preSelectedService = location.state?.selectService || '';
  const preSelectedSubService = location.state?.selectSubService || '';

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    serviceName: preSelectedService,
    subServiceName: preSelectedSubService,
    preferredDate: '',
    preferredTime: '',
    notes: location.state?.customNotes || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  // Auto-save State / LocalStorage Restore on mount
  useEffect(() => {
    document.title = "Schedule Care - Nest Cares.in";
    
    const savedData = localStorage.getItem('healthcare_booking_draft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          ...parsed,
          serviceName: preSelectedService || parsed.serviceName || '',
          subServiceName: preSelectedSubService || parsed.subServiceName || ''
        }));
      } catch (e) {
        console.warn('Failed to parse booking localStorage draft');
      }
    }
  }, [preSelectedService, preSelectedSubService]);

  // Sync state if navigation target changes
  useEffect(() => {
    if (preSelectedService) {
      setFormData(prev => {
        const updated = { 
          ...prev, 
          serviceName: preSelectedService,
          subServiceName: preSelectedSubService 
        };
        localStorage.setItem('healthcare_booking_draft', JSON.stringify(updated));
        return updated;
      });
    }
  }, [preSelectedService, preSelectedSubService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      let updated = { ...prev, [name]: value };
      
      // Reset sub-treatment option if parent category changes
      if (name === 'serviceName') {
        updated.subServiceName = '';
      }
      
      localStorage.setItem('healthcare_booking_draft', JSON.stringify(updated));
      return updated;
    });
  };

  const validateForm = () => {
    if (!formData.serviceName) return 'Please select a healthcare service category.';
    if (!formData.subServiceName) return 'Please select a specific sub-service treatment.';
    if (!formData.name.trim()) return 'Patient Full Name is required.';
    if (!formData.mobile.trim() || !/^\+?[\d\s-]{10,15}$/.test(formData.mobile)) {
      return 'Please enter a valid mobile number (min 10 digits).';
    }
    if (!formData.preferredDate) return 'Please select an appointment date.';
    if (!formData.preferredTime) return 'Please select a preferred time slot.';
    if (!formData.address.trim()) return 'Service delivery address is required.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      addToast(validationError, 'error');
      return;
    }

    setLoading(true);

    try {
      const res = await bookingsAPI.createBooking(formData);
      if (res.success) {
        setCreatedBooking(res.data);
        setSuccess(true);
        localStorage.removeItem('healthcare_booking_draft');
        addToast('Appointment request registered successfully!', 'success');
      } else {
        addToast(res.message || 'Failed to submit booking request.', 'error');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to submit booking request. Please check connection.';
      addToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetBookingForm = () => {
    setFormData({
      name: '',
      mobile: '',
      email: '',
      address: '',
      serviceName: '',
      subServiceName: '',
      preferredDate: '',
      preferredTime: '',
      notes: '',
    });
    setSuccess(false);
    setCreatedBooking(null);
    setLoading(false);
  };

  const servicesList = Array.isArray(services) ? services : [];
  const selectedServiceObj = servicesList.find(s => s && s.title === formData.serviceName);
  const availableSubServices = selectedServiceObj && Array.isArray(selectedServiceObj.subServices) 
    ? selectedServiceObj.subServices 
    : [];

  const timeSlots = [
    'Morning (08:00 AM - 12:00 PM)',
    'Afternoon (12:00 PM - 04:00 PM)',
    'Evening (04:00 PM - 08:00 PM)',
    'Night Emergency (08:00 PM - 08:00 AM)'
  ];

  // Success Confirmation Screen
  if (success && createdBooking) {
    return (
      <div className="bg-[#fdfcfb] min-h-[80vh] flex items-center justify-center font-sans py-12">
        <div className="max-w-md w-full mx-auto px-4">
          <Card className="text-center flex flex-col items-center gap-5 shadow-md border-t-4 border-teal-800 rounded-2xl p-6">
            
            <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-800 animate-bounce">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">Appointment Request Sent!</h1>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed font-semibold">
                Thank you for choosing bedside care. Triage ticket: <strong className="text-teal-800 font-bold">{createdBooking.bookingId}</strong> has been registered.
              </p>
            </div>

            {/* Booking Details Card summary */}
            <div className="bg-slate-50 w-full p-4.5 rounded-xl border border-slate-200 text-left text-xs sm:text-sm space-y-2.5 font-semibold text-slate-700">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-550 uppercase text-xs tracking-wider">Triage Summary</span>
                <span className="px-2.5 py-1 bg-teal-100 text-teal-900 text-[10px] font-extrabold rounded-full uppercase">Pending Coordination</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Booking ID:</span>
                <span className="font-bold text-slate-800">{createdBooking.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patient:</span>
                <span className="font-bold text-slate-800">{createdBooking.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Service:</span>
                <span className="font-bold text-slate-800">{createdBooking.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Treatment:</span>
                <span className="font-bold text-teal-800">{createdBooking.subServiceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scheduled Date:</span>
                <span className="font-bold text-slate-800">{createdBooking.preferredDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Preferred Slot:</span>
                <span className="font-bold text-slate-800">{createdBooking.preferredTime}</span>
              </div>
              <div className="flex flex-col gap-1 pt-1.5 border-t border-slate-200/60">
                <span className="text-slate-400">Delivery Address:</span>
                <span className="font-semibold text-slate-600 text-left leading-normal">{createdBooking.address}</span>
              </div>
            </div>

            <div className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3.5 w-full font-semibold">
              💡 A medical dispatch coordinator will call you at <strong>{createdBooking.mobile}</strong> within 15 minutes to match clinical specialists.
            </div>

            <a 
              href={`https://wa.me/919248849388?text=${encodeURIComponent(
                `Hello Nest Cares, here is my booking copy:\n` +
                `• Booking ID: ${createdBooking.bookingId}\n` +
                `• Patient: ${createdBooking.name}\n` +
                `• Service: ${createdBooking.serviceName} (${createdBooking.subServiceName})\n` +
                `• Date: ${createdBooking.preferredDate}\n` +
                `• Slot: ${createdBooking.preferredTime}\n` +
                `• Address: ${createdBooking.address}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-97 text-center cursor-pointer font-sans"
            >
              <svg className="fill-white shrink-0" style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }} viewBox="0 0 24 24">
                <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.88.52 3.63 1.43 5.16L2 22l4.98-1.32c1.47.8 3.12 1.25 4.86 1.25 5.52 0 10-4.48 10-10.004C21.84 6.48 17.38 2 12.004 2zM12 20.354c-1.63 0-3.23-.44-4.63-1.27l-.33-.2-3.44.91.93-3.35-.22-.35c-.91-1.45-1.39-3.13-1.39-4.88 0-4.73 3.85-8.58 8.58-8.58 2.29 0 4.45.89 6.07 2.51a8.5 8.5 0 0 1 2.51 6.07c0 4.73-3.85 8.58-8.58 8.58zm4.72-6.47c-.26-.13-1.52-.75-1.76-.84-.23-.09-.4-.13-.57.13-.17.26-.66.84-.81 1.01-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.1-1.29-.77-.69-1.29-1.55-1.44-1.81-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.33-.02-.46-.07-.13-.57-1.37-.78-1.88-.2-.5-.42-.43-.57-.44h-.49c-.17 0-.45.06-.69.31-.24.25-.92.9-1 .9-1 .9 0 1.94-.17 2.05.08.3.13.56.24.81.42 1.15.82 2 2.2 2.68.86.35 1.52.39 2.09.3.64-.09 1.52-.61 1.73-1.2.22-.59.22-1.1.15-1.2-.07-.1-.26-.16-.52-.29z" />
              </svg>
              <span>Save & Share Booking on WhatsApp</span>
            </a>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-1.5">
              <Link to="/" className="w-full">
                <Button variant="primary" className="w-full">Return to Home</Button>
              </Link>
              <Button variant="secondary" className="w-full" onClick={resetBookingForm}>
                Book Another
              </Button>
            </div>

          </Card>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Schedule Bedside Care"
      description="Specify patient credentials and select setup coordinates. No advanced payment is required online."
      breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Book Service' }]}
    >
      <div className="max-w-xl mx-auto">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            
            {/* 1. Care Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-teal-850 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                <HeartPulse className="w-4.5 h-4.5 text-teal-700" />
                <span>1. Care Selection</span>
              </h3>
              
              <Select
                label="Service Category"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                options={servicesList.filter(s => s && s.active && s.bookable).map(s => s.title)}
                placeholder="Choose category"
                required
                disabled={preSelectedService !== ''}
              />

              {formData.serviceName && (
                <div className="space-y-2.5 pt-1">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wider block">
                    Select the Sub-Service (Treatment) <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableSubServices.map((sub, idx) => {
                      const subName = typeof sub === 'object' ? sub.name : sub;
                      const isSelected = formData.subServiceName === subName;
                      
                      return (
                        <button
                          type="button"
                          key={idx}
                          disabled={preSelectedSubService !== '' && preSelectedSubService !== subName}
                          onClick={() => {
                            if (preSelectedSubService) return;
                            setFormData(prev => {
                              const updated = { ...prev, subServiceName: subName };
                              localStorage.setItem('healthcare_booking_draft', JSON.stringify(updated));
                              return updated;
                            });
                          }}
                          className={`group flex items-center justify-between w-full px-4 py-3.5 text-left rounded-xl border transition-all duration-300 outline-none select-none cursor-pointer ${
                            isSelected 
                              ? 'border-teal-800 bg-teal-50/30 text-teal-950 font-bold ring-2 ring-teal-500/5' 
                              : 'border-slate-200 bg-white hover:bg-slate-50/50 text-slate-700 hover:border-slate-350'
                          } ${(preSelectedSubService !== '' && preSelectedSubService !== subName) ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          <span className="text-sm pr-2">{subName}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                            isSelected 
                              ? 'border-teal-850 bg-teal-800 text-white' 
                              : 'border-slate-300 bg-white group-hover:border-slate-400'
                          }`}>
                            {isSelected && (
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Patient Information */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-teal-855 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                <User className="w-4.5 h-4.5 text-teal-700" />
                <span>2. Patient Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Patient Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  icon={<User className="w-4 h-4 text-slate-400" />}
                  required
                />
                
                <Input
                  label="Mobile Number"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter 10-digit number"
                  type="tel"
                  icon={<Phone className="w-4 h-4 text-slate-400" />}
                  required
                />
              </div>

              <Input
                label="Email ID (Optional)"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. name@email.com"
                icon={<Mail className="w-4 h-4 text-slate-400" />}
              />
            </div>

            {/* 3. Delivery & Schedule */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-teal-855 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                <Calendar className="w-4.5 h-4.5 text-teal-700" />
                <span>3. Schedule & Address</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Preferred Date"
                  name="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  icon={<Calendar className="w-4 h-4 text-slate-400" />}
                  required
                />

                <Select
                  label="Preferred Time Slot"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  options={timeSlots}
                  placeholder="Choose slot"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Service Delivery Address</label>
                <div className="relative rounded-xl overflow-hidden border border-slate-200 focus-within:border-teal-800/80 transition-all flex items-start p-3 gap-2.5 bg-white">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your street address, colony, and landmark in Nizamabad"
                    rows={3}
                    className="w-full text-sm font-semibold text-slate-900 border-none outline-none resize-none placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Additional Patient Notes (Optional)</label>
                <div className="relative rounded-xl overflow-hidden border border-slate-200 focus-within:border-teal-800/80 transition-all flex items-start p-3 gap-2.5 bg-white">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Describe patient history, diagnostics, special requirements, or coordinator comments"
                    rows={3.5}
                    className="w-full text-sm font-semibold text-slate-900 border-none outline-none resize-none placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Submission Buttons */}
            <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                loading={loading}
                className="w-full py-4 text-sm font-extrabold uppercase tracking-wider bg-teal-800 hover:bg-teal-900"
              >
                <span>Confirm Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-xs text-center text-slate-500 leading-relaxed font-semibold">
                By clicking confirm, your triage request will be registered instantly. A coordinator will phone you back in 15 minutes to verify setup details. No advanced payment is required.
              </p>
            </div>
            
          </form>
        </Card>
      </div>
    </PageLayout>
  );
};

export default BookService;
