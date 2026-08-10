import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, User, Phone, Mail, MapPin, 
  FileText, CheckCircle2, ArrowRight, ShieldCheck, HeartPulse, Sparkles,
  AlertCircle, MessageSquare, Check, RefreshCw
} from 'lucide-react';
import { bookingsAPI } from '../services/api';

const DEFAULT_SERVICES = [
  {
    title: 'Doctor Consultation',
    icon: '🩺',
    sub: [
      { name: 'Home Doctor Visit', price: 1500, desc: 'Senior MBBS / MD physician visits your home for full physical examination.' },
      { name: 'Tele Consultation', price: 600, desc: 'Audio / Video triage consultation with certified general physician.' },
      { name: 'Specialist Doctor Visit', price: 2500, desc: 'Specialist physician visit (Cardio, Neuro, Ortho, Pulmonology).' }
    ]
  },
  {
    title: 'Ambulance Services',
    icon: '🚑',
    sub: [
      { name: 'Emergency Response Ambulance', price: 3000, desc: 'Basic Life Support (BLS) rapid dispatch ambulance with oxygen and paramedic.' },
      { name: 'ICU Ventilator Ambulance', price: 6500, desc: 'Advanced Life Support (ALS) with ventilator, multipara monitor, and emergency doctor.' },
      { name: 'Inter-City Patient Transport', price: 8000, desc: 'Long-distance patient transfer with continuous clinical monitoring.' }
    ]
  },
  {
    title: 'Nursing Services',
    icon: '👩‍⚕️',
    sub: [
      { name: 'General Nursing Care (12h Shift)', price: 2500, desc: 'Bedside nurse for vitals monitoring, hygiene, and daily medication logs.' },
      { name: '24/7 Live-in Home Nursing', price: 4500, desc: 'Round-the-clock intensive clinical nursing care at home.' },
      { name: 'Wound Dressing & Stitch Removal', price: 800, desc: 'Aseptic dressing changes for surgical, diabetic, or trauma wounds.' },
      { name: 'Bed Sore Care & Management', price: 1200, desc: 'Specialized sore dressings, positioning protocol, and air bed setup.' },
      { name: 'Tracheostomy / Ryle\'s Tube Care', price: 1500, desc: 'Suctioning, cannula cleaning, and stoma site care.' }
    ]
  },
  {
    title: 'ICU Setup at Home',
    icon: '🏥',
    sub: [
      { name: 'Complete Home ICU Setup', price: 15000, desc: 'Hospital bed, ventilator, monitor, suction, oxygen, and 24/7 ICU nurse.' },
      { name: 'ICU Hospital Bed Rental', price: 4000, desc: 'Motorized 5-function / 3-function hospital bed with remote controls.' },
      { name: 'Multipara Patient Monitor', price: 3000, desc: '5-para monitor for ECG, SpO2, NIBP, respiration, and temperature.' },
      { name: 'BiPAP / CPAP Machine Setup', price: 5000, desc: 'Non-invasive ventilator setup with mask fitting and pressure titration.' },
      { name: 'Oxygen Concentrator (10L / 5L)', price: 4500, desc: 'Medical-grade continuous oxygen flow generator.' }
    ]
  },
  {
    title: 'Laboratory Services',
    icon: '🔬',
    sub: [
      { name: 'Home Blood Sample Collection', price: 300, desc: 'Certified phlebotomist collects blood samples right at your doorstep.' },
      { name: 'Complete Health Package (60+ Tests)', price: 1999, desc: 'CBC, Lipid, LFT, KFT, Thyroid, Blood Sugar, and Urine routine.' },
      { name: 'Cardiac & Diabetic Profile', price: 1499, desc: 'HbA1c, Fasting Sugar, Lipid Panel, Serum Creatinine, and Electrolytes.' }
    ]
  },
  {
    title: 'Physiotherapy',
    icon: '💪',
    sub: [
      { name: 'Home Physiotherapy Session', price: 1000, desc: 'Certified physiotherapist delivers 45-min targeted mobility therapy.' },
      { name: 'Post-Surgery Joint Rehabilitation', price: 1200, desc: 'Knee / hip replacement post-op mobility and gait recovery.' },
      { name: 'Neurological & Stroke Recovery', price: 1500, desc: 'Neuro-rehabilitation for stroke, Parkinson\'s, or paralysis recovery.' }
    ]
  },
  {
    title: 'Dietician Advisory',
    icon: '🍎',
    sub: [
      { name: 'Personalized Clinical Diet Plan', price: 1200, desc: 'Custom nutrition chart formulated based on medical reports & lifestyle.' },
      { name: 'Diabetes & Renal Diet Consultation', price: 1500, desc: 'Specialized glycemic-control and renal-friendly nutrition counseling.' }
    ]
  }
];

const NIZAMABAD_LOCALITIES = [
  'Chandra Shekar Colony', 'Pragathi Nagar', 'Subhash Nagar', 
  'Khaleelwadi', 'Vinayak Nagar', 'Armoor Road', 'Bodhan Road', 'Kanteshwar'
];

const TIME_SLOTS = [
  { id: 'Immediate', label: '⚡ Immediate (Within 15-30 Mins)', desc: 'Priority clinical response' },
  { id: 'Morning (08:00 AM - 12:00 PM)', label: '🌅 Morning', desc: '08:00 AM - 12:00 PM' },
  { id: 'Afternoon (12:00 PM - 04:00 PM)', label: '☀️ Afternoon', desc: '12:00 PM - 04:00 PM' },
  { id: 'Evening (04:00 PM - 08:00 PM)', label: '🌙 Evening', desc: '04:00 PM - 08:00 PM' }
];

const BookingForm = ({ 
  services = [], 
  preSelectedCategory = '', 
  preSelectedSubService = '',
  onSuccess = null 
}) => {
  // Combine CMS services with default rich subservice data
  const activeServicesList = DEFAULT_SERVICES;

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    serviceName: preSelectedCategory || activeServicesList[0].title,
    subServiceName: preSelectedSubService || activeServicesList[0].sub[0].name,
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTime: 'Morning (08:00 AM - 12:00 PM)',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Sync if preSelected props change
  useEffect(() => {
    if (preSelectedCategory) {
      const matchCat = activeServicesList.find(s => s.title.toLowerCase() === preSelectedCategory.toLowerCase());
      if (matchCat) {
        setFormData(prev => ({
          ...prev,
          serviceName: matchCat.title,
          subServiceName: preSelectedSubService || matchCat.sub[0]?.name || ''
        }));
      }
    }
  }, [preSelectedCategory, preSelectedSubService]);

  // Current selected category and subservice objects
  const selectedCategoryObj = activeServicesList.find(s => s.title === formData.serviceName) || activeServicesList[0];
  const selectedSubServiceObj = selectedCategoryObj?.sub.find(sub => sub.name === formData.subServiceName) || selectedCategoryObj?.sub[0];

  const handleCategoryChange = (catTitle) => {
    const cat = activeServicesList.find(s => s.title === catTitle);
    setFormData(prev => ({
      ...prev,
      serviceName: catTitle,
      subServiceName: cat ? cat.sub[0].name : ''
    }));
  };

  const handleSubServiceChange = (subName) => {
    setFormData(prev => ({ ...prev, subServiceName: subName }));
  };

  const handleDateQuickSelect = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setFormData(prev => ({ ...prev, preferredDate: d.toISOString().split('T')[0] }));
  };

  const handleLocalityTag = (locality) => {
    setFormData(prev => {
      const current = prev.address.trim();
      if (!current) return { ...prev, address: `${locality}, Nizamabad` };
      if (current.includes(locality)) return prev;
      return { ...prev, address: `${current}, ${locality}, Nizamabad` };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.name.trim()) {
      setError('Please enter the patient’s full name.');
      return;
    }
    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.address.trim()) {
      setError('Please provide the service delivery address in Nizamabad.');
      return;
    }
    if (!formData.preferredDate) {
      setError('Please select an appointment date.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim() || 'nestcares.in@gmail.com',
        address: formData.address.trim(),
        serviceName: formData.serviceName,
        subServiceName: formData.subServiceName,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        notes: formData.notes.trim() || 'Booked via unified web portal'
      };

      const res = await bookingsAPI.createBooking(payload);

      if (res.success && res.data) {
        setConfirmedBooking(res.data);
        if (onSuccess) onSuccess(res.data);
      } else {
        setError(res.message || 'Failed to register booking. Please try again.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setError(err.response?.data?.message || err.message || 'Network connection issue. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setConfirmedBooking(null);
    setError('');
    setFormData({
      name: '',
      mobile: '',
      email: '',
      address: '',
      serviceName: activeServicesList[0].title,
      subServiceName: activeServicesList[0].sub[0].name,
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: 'Morning (08:00 AM - 12:00 PM)',
      notes: ''
    });
  };

  // WhatsApp Share URL Generator
  const getWhatsAppBookingUrl = (booking) => {
    const text = `*New Booking Request - Nest Cares Nizamabad*\n` +
      `• *Booking ID:* ${booking.bookingId}\n` +
      `• *Patient:* ${booking.name}\n` +
      `• *Phone:* ${booking.mobile}\n` +
      `• *Service:* ${booking.serviceName}\n` +
      `• *Treatment:* ${booking.subServiceName}\n` +
      `• *Date:* ${booking.preferredDate}\n` +
      `• *Time Slot:* ${booking.preferredTime}\n` +
      `• *Address:* ${booking.address}\n\n` +
      `_Please confirm availability and dispatch coordinator._`;
    return `https://wa.me/919248849388?text=${encodeURIComponent(text)}`;
  };

  // SUCCESS CONFIRMATION STATE
  if (confirmedBooking) {
    return (
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-[0_20px_60px_rgba(5,150,105,0.08)] p-8 sm:p-12 text-center max-w-2xl mx-auto animate-fadeIn">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-100/80 text-emerald-800 rounded-full text-xs font-black uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Appointment Confirmed
        </span>

        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Thank You, {confirmedBooking.name}!
        </h3>
        
        <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto leading-relaxed">
          Your booking request has been registered under reference ID:
        </p>

        <div className="my-6 p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-lg mx-auto shadow-xl">
          <div className="text-left">
            <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">Official Booking ID</span>
            <span className="text-2xl font-black tracking-wider text-white">{confirmedBooking.bookingId}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3.5 py-2 rounded-xl text-teal-200">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Saved in System</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-left space-y-3 max-w-lg mx-auto text-xs text-slate-700">
          <div className="flex justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-500 font-medium">Selected Service:</span>
            <span className="font-bold text-slate-900">{confirmedBooking.serviceName} ({confirmedBooking.subServiceName})</span>
          </div>
          <div className="flex justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-500 font-medium">Scheduled Date:</span>
            <span className="font-bold text-slate-900">{confirmedBooking.preferredDate} ({confirmedBooking.preferredTime})</span>
          </div>
          <div className="flex justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-500 font-medium">Contact Phone:</span>
            <span className="font-bold text-slate-900">{confirmedBooking.mobile}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Delivery Address:</span>
            <span className="font-bold text-slate-900 text-right max-w-[240px] truncate">{confirmedBooking.address}</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-6 leading-relaxed">
          📞 Our senior healthcare coordinator is reviewing your request and will call you on <strong className="text-slate-800">{confirmedBooking.mobile}</strong> within 15 minutes to confirm logistics.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <a
            href={getWhatsAppBookingUrl(confirmedBooking)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Save & Share on WhatsApp</span>
          </a>

          <button
            onClick={resetForm}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-2xl transition-colors"
          >
            Book Another Service
          </button>
        </div>
      </div>
    );
  }

  // ACTIVE BOOKING FORM
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.06)] p-6 sm:p-10 text-left max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="border-b border-slate-100 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-800 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-teal-100">
            <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
            Standard Care Booking
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Schedule Home Healthcare
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Choose your treatment, select your time, and certified clinicians will arrive at your home.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl self-start sm:self-auto">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div className="text-[11px]">
            <span className="font-black text-slate-900 block leading-none">100% Verified</span>
            <span className="text-slate-500 text-[9px] uppercase tracking-wider font-bold">Nizamabad Only</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* SECTION 1: Service Category Selection */}
      <div className="mb-8">
        <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
          1. Select Healthcare Service Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {activeServicesList.map((service) => {
            const isSelected = formData.serviceName === service.title;
            return (
              <button
                key={service.title}
                type="button"
                onClick={() => handleCategoryChange(service.title)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 min-h-[85px] ${
                  isSelected
                    ? 'bg-teal-900 text-white border-teal-900 shadow-md shadow-teal-900/10 scale-[1.02]'
                    : 'bg-slate-50 hover:bg-slate-100/80 text-slate-800 border-slate-200/80'
                }`}
              >
                <span className="text-xl">{service.icon}</span>
                <span className="text-xs font-bold leading-tight line-clamp-2">
                  {service.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Specific Treatment / Subservice Selection */}
      <div className="mb-8 p-5 bg-slate-50 border border-slate-200/80 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-black text-slate-900 uppercase tracking-wider">
            2. Choose Specific Treatment / Equipment
          </label>
          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
            {selectedCategoryObj.sub.length} Options Available
          </span>
        </div>

        <div className="space-y-2">
          {selectedCategoryObj.sub.map((sub) => {
            const isSelected = formData.subServiceName === sub.name;
            return (
              <div
                key={sub.name}
                onClick={() => handleSubServiceChange(sub.name)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-white border-teal-600 ring-2 ring-teal-600/10 shadow-sm'
                    : 'bg-white/60 hover:bg-white border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'bg-teal-700 border-teal-700 text-white' : 'border-slate-300'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{sub.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{sub.desc}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-emerald-700">₹{sub.price.toLocaleString()}</span>
                  <span className="text-[9px] text-slate-400 block font-medium">Standard Fee</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Patient Information & Contact */}
      <div className="mb-8">
        <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
          3. Patient Details & Contact
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Patient Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              10-Digit Mobile Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="e.g. 9248849388"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Email Address (For Booking Copy & Receipts)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="e.g. name@example.com (Optional)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Schedule Date & Time Slot */}
      <div className="mb-8">
        <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
          4. Appointment Date & Preferred Time
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Select Date *
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
            />
          </div>

          <div className="sm:col-span-2 flex items-end gap-2">
            <button
              type="button"
              onClick={() => handleDateQuickSelect(0)}
              className="flex-1 py-3 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleDateQuickSelect(1)}
              className="flex-1 py-3 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 transition-colors"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => handleDateQuickSelect(2)}
              className="flex-1 py-3 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 transition-colors"
            >
              In 2 Days
            </button>
          </div>
        </div>

        {/* Time Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {TIME_SLOTS.map((slot) => {
            const isSelected = formData.preferredTime === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setFormData({ ...formData, preferredTime: slot.id })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-teal-900 text-white border-teal-900 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">{slot.label}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-teal-200' : 'text-slate-500'}`}>{slot.desc}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-teal-300" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: Service Delivery Address in Nizamabad */}
      <div className="mb-8">
        <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
          5. Service Delivery Address in Nizamabad *
        </label>
        
        {/* Nizamabad Locality Quick Chips */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase py-1 mr-1">Quick Select Area:</span>
          {NIZAMABAD_LOCALITIES.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => handleLocalityTag(loc)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold transition-colors"
            >
              + {loc}
            </button>
          ))}
        </div>

        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <textarea
            required
            rows={3}
            placeholder="House / Flat No., Landmark, Colony, Street, Nizamabad - 503002"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
          />
        </div>

        <div className="mt-3">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
            Special Medical Notes / Symptoms (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Patient requires oxygen setup, elderly with limited mobility, doctor prescription attached"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
          />
        </div>
      </div>

      {/* SUMMARY & SUBMIT BUTTON */}
      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-left">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Estimated Fee</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">₹{selectedSubServiceObj.price.toLocaleString()}</span>
            <span className="text-xs text-slate-500 font-medium">({selectedSubServiceObj.name})</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">✓ Pay after treatment / equipment installation</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-4 bg-teal-800 hover:bg-teal-900 active:scale-[0.98] disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-teal-900/15 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Registering Booking...</span>
            </>
          ) : (
            <>
              <span>Confirm & Book Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

    </form>
  );
};

export default BookingForm;
