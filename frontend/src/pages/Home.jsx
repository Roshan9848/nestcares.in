import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, HeartPulse, Clock, Phone, Award, 
  ArrowRight, CheckCircle2, Sparkles, Star, Users, 
  Activity, Stethoscope, ChevronRight, HelpCircle,
  Truck, Microscope, UserCheck, Check, MessageSquare, ChevronDown,
  MapPin, PhoneCall, Calendar, Zap, ArrowUpRight
} from 'lucide-react';
import { resolveImageUrl } from '../utils/url';

const LUXURY_SERVICES = [
  {
    id: 'doctor-consultation',
    title: 'Doctor Consultation',
    teluguTitle: 'డాక్టర్ హోమ్ విజిట్',
    desc: 'Senior MBBS / MD physicians visit your home in Nizamabad for physical examination, diagnostics, and prescriptions.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    badge: 'Home Visit',
    icon: Stethoscope,
    tags: ['General Medicine', 'Specialist Visits', 'Bedside Care'],
    badgeStyle: 'bg-teal-50 text-teal-800 border-teal-200'
  },
  {
    id: 'ambulance-services',
    title: '24/7 Ambulance Dispatch',
    teluguTitle: '24/7 అంబులెన్స్ సేవలు',
    desc: 'Rapid Basic Life Support (BLS) and Advanced ICU Ventilator ambulances with emergency paramedics on standby.',
    image: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&q=80&w=600',
    badge: '15-Min Response',
    emergency: true,
    icon: Truck,
    tags: ['Oxygen Support', 'ICU Ventilator', 'Inter-City Transfer'],
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  {
    id: 'nursing-services',
    title: 'Professional Home Nursing',
    teluguTitle: 'ప్రొఫెషనల్ హోమ్ నర్సింగ్',
    desc: 'Certified ICU and general bedside nurses for 12h / 24h continuous clinical care, wound dressing, and vitals monitoring.',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600',
    badge: '12h / 24h Shifts',
    icon: HeartPulse,
    tags: ['Bedside Care', 'Tracheostomy', 'Injections & IV'],
    badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  {
    id: 'icu-setup',
    title: 'ICU Setup at Home',
    teluguTitle: 'ఇంటి వద్ద ICU సెటప్',
    desc: 'Complete hospital-grade intensive care unit in your bedroom: motorized ICU bed, ventilator, 5-para monitor, and oxygen.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
    badge: 'Hospital-Grade',
    icon: Activity,
    tags: ['Motorized ICU Bed', 'BiPAP / CPAP', 'Multipara Monitor'],
    badgeStyle: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  {
    id: 'lab-services',
    title: 'Doorstep Lab Diagnostics',
    teluguTitle: 'డోర్‌స్టెప్ ల్యాబ్ టెస్ట్‌లు',
    desc: 'Certified phlebotomists collect blood & urine samples at your home. NABL certified test reports delivered in 4-6 hours.',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=600',
    badge: 'Doorstep Sample',
    icon: Microscope,
    tags: ['Complete Health Panel', 'Cardiac Profile', 'Fast Reports'],
    badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  {
    id: 'physiotherapy',
    title: 'Home Physiotherapy',
    teluguTitle: 'హోమ్ ఫిజియోథెరపీ',
    desc: 'Licensed physiotherapists for post-surgery joint rehabilitation, neuro-recovery, stroke rehab, and geriatric mobility.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600',
    badge: 'Mobility Rehab',
    icon: UserCheck,
    tags: ['Stroke Recovery', 'Joint Mobility', 'Pain Relief'],
    badgeStyle: 'bg-indigo-50 text-indigo-800 border-indigo-200'
  }
];

const LUXURY_PILLARS = [
  {
    title: 'Zero Advance Required',
    desc: 'Pay transparently only after medical setup or bedside care is delivered.',
    icon: CheckCircle2,
    iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  },
  {
    title: '100% Certified Clinicians',
    desc: 'All doctors, nurses, and technicians hold active state medical council registrations.',
    icon: ShieldCheck,
    iconBg: 'bg-teal-50 text-teal-700 border border-teal-200'
  },
  {
    title: 'Hospital-Grade Bio-Equipment',
    desc: 'Calibrated ventilators, multipara monitors, and sanitized ICU motorized beds.',
    icon: Activity,
    iconBg: 'bg-blue-50 text-blue-700 border border-blue-200'
  },
  {
    title: '15-Minute Response Protocol',
    desc: 'Dedicated emergency medical coordinator desk in Nizamabad for rapid triage.',
    icon: Clock,
    iconBg: 'bg-amber-50 text-amber-700 border border-amber-200'
  }
];

const LUXURY_FAQS = [
  {
    q: 'How quickly can a doctor or ambulance arrive at our home in Nizamabad?',
    a: 'For emergency ambulance dispatch, our vehicles arrive within 15-30 minutes across Nizamabad municipal limits. Scheduled doctor home visits and nursing shifts are arranged for your preferred time slot.'
  },
  {
    q: 'Do I need to pay any advance fee before service starts?',
    a: 'No. Zero advance payment is required for initial coordinator triage or scheduling. Payment is collected transparently only after clinicians or medical equipment arrive at your home.'
  },
  {
    q: 'What medical equipment is included in a complete Home ICU Setup?',
    a: 'A complete home ICU setup includes a motorized ICU bed with remote adjustments, critical care ventilator (BiPAP/CPAP/Invasive), 5-para vital signs monitor, suction machine, continuous oxygen concentrator, and a 24/7 ICU-trained bedside nurse.'
  },
  {
    q: 'Are all nurses and clinicians certified in Telangana?',
    a: 'Yes. 100% of our doctors, nurses, and phlebotomists hold valid state registrations (TSMC / Telangana Nursing Council) and undergo thorough clinical verification.'
  }
];

const Home = ({ 
  services = [], 
  testimonials = [], 
  faqs = [], 
  doctors = [],
  webSettings, 
  contactSettings 
}) => {
  const navigate = useNavigate();
  const phone = contactSettings?.phoneNumbers?.[0] || "+91 92488 49388";
  const whatsapp = contactSettings?.whatsappNumber || "+91 92488 49388";
  const cleanPhone = phone.replace(/\s+/g, '');
  const cleanWhatsapp = whatsapp.replace(/\D/g, '');

  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  const displayFaqs = (faqs && faqs.length > 0) ? faqs : LUXURY_FAQS;

  const displayDoctors = (doctors && doctors.length > 0) 
    ? doctors.filter(d => d.isActive !== false && d.active !== false)
    : [
        {
          _id: 'doc_1',
          name: 'Dr. K. Srinivas Reddy',
          specialty: 'Senior General Physician & Geriatrician',
          qualifications: 'MBBS, MD (General Medicine)',
          experience: '14+ Years Exp',
          image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
          availability: 'Mon - Sat (9:00 AM - 7:00 PM)'
        },
        {
          _id: 'doc_2',
          name: 'Dr. Ananya Sharma',
          specialty: 'Critical Care & ICU Consultant',
          qualifications: 'MBBS, DA, DNB (Critical Care)',
          experience: '10+ Years Exp',
          image: 'https://images.unsplash.com/photo-1594824813689-53b9f4e2f9d6?auto=format&fit=crop&q=80&w=400',
          availability: '24/7 Standby on Request'
        },
        {
          _id: 'doc_3',
          name: 'Dr. M. Venkat Rao',
          specialty: 'Consultant Cardiologist & Physician',
          qualifications: 'MBBS, MD, DM (Cardiology)',
          experience: '16+ Years Exp',
          image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
          availability: 'Mon, Wed, Fri (2:00 PM - 6:00 PM)'
        }
      ];

  const handleBookService = (serviceTitle) => {
    navigate('/book', { state: { selectService: serviceTitle } });
  };

  return (
    <div className="min-h-screen text-slate-800 font-sans relative pb-28 pt-8">
      
      {/* ========================================================
          1. PROFESSIONAL HERO SECTION (CLEAN & CONFIDENT)
      ======================================================== */}
      <section className="relative pt-8 sm:pt-16 pb-12 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        
        <div className="max-w-4xl space-y-6 sm:space-y-8">
          
          {/* Location & Live Dispatch Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm font-bold shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-extrabold text-slate-900">Nizamabad</span>
            <span className="text-slate-400">•</span>
            <span>15-Minute Clinical Response Protocol Active</span>
          </div>

          {/* Large Bold Headline with Trust Typography */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.08]">
            Hospital-Grade Intensive Care <br className="hidden sm:inline" />
            <span className="text-teal-800">
              In Your Home.
            </span>
          </h1>

          {/* Generous Subtitle */}
          <p className="text-slate-600 text-sm sm:text-xl leading-relaxed max-w-2xl font-normal">
            Certified doctors, 24/7 ICU bedside nurses, emergency ambulances, and complete hospital bedroom setups with zero advance payment.
          </p>

          {/* High-Impact Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link
              to="/book"
              className="px-8 py-4 bg-teal-800 hover:bg-teal-900 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-102 flex items-center justify-center gap-2.5"
            >
              <span>Book Appointment Online</span>
              <ArrowRight className="w-5 h-5 text-teal-200" />
            </Link>

            <a
              href={`tel:${cleanPhone}`}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2.5"
            >
              <PhoneCall className="w-5 h-5 text-teal-700" />
              <span>Call Helpline: {phone}</span>
            </a>
          </div>

          {/* 3 Elevated Frosted Glass Metric Pills */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 max-w-2xl">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
              <span className="text-2xl sm:text-4xl font-black text-teal-800 block leading-none">15 Min</span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider block mt-2">Fast Dispatch</span>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
              <span className="text-2xl sm:text-4xl font-black text-emerald-700 block leading-none">10,000+</span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider block mt-2">Patients Cared</span>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
              <span className="text-2xl sm:text-4xl font-black text-amber-600 block leading-none">4.9 ★</span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider block mt-2">Patient Rating</span>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================
          2. SERVICES CATALOG (CLEAN, ELEVATED & INFORMATIVE)
      ======================================================== */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              Specialized Medical Services
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Clinical Care Services in Nizamabad
            </h2>
            <p className="text-slate-600 text-xs sm:text-base max-w-xl">
              Select your requirement. Our medical team will coordinate bedside arrival and hospital-grade setups.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-teal-800 hover:text-teal-900 uppercase tracking-wider transition-colors shrink-0"
          >
            <span>Explore All Treatments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3-Column Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LUXURY_SERVICES.map((serv) => {
            const Icon = serv.icon;
            return (
              <div 
                key={serv.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-400 transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
                onClick={() => handleBookService(serv.title)}
              >
                <div>
                  {/* Photo Banner with Clean Gradient Overlay */}
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={serv.image} 
                      alt={serv.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm border ${serv.badgeStyle}`}>
                        {serv.badge}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center text-teal-800 shadow-md group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-7 space-y-3">
                    <h3 className="text-xl font-black text-slate-950 group-hover:text-teal-800 transition-colors leading-tight">
                      {serv.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                      {serv.desc}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {serv.tags.map(tag => (
                        <span key={tag} className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-6 sm:p-7 pt-0">
                  <button
                    type="button"
                    className="w-full py-3.5 bg-slate-100 group-hover:bg-teal-800 group-hover:text-white text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200"
                  >
                    <span>Book Appointment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================
          3. 24/7 EMERGENCY AMBULANCE BANNER (HIGH-CONTRAST RED)
      ======================================================== */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-6 sm:p-10 rounded-3xl relative overflow-hidden bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 text-white text-left flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-rose-400/40">
          
          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/30">
              <Truck className="w-4 h-4 text-white" />
              <span>24/7 Rapid Emergency Response</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Need an Emergency ICU Ambulance in Nizamabad?
            </h3>
            
            <p className="text-rose-100 text-xs sm:text-base leading-relaxed">
              Equipped with invasive ICU ventilators, multipara monitors, oxygen manifolds, and trained emergency clinical paramedics.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10">
            <a
              href={`tel:${cleanPhone}`}
              className="px-8 py-4 bg-white hover:bg-rose-50 active:scale-[0.98] text-rose-700 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <PhoneCall className="w-5 h-5 text-rose-600 animate-bounce" />
              <span>Call Emergency: {phone}</span>
            </a>
          </div>

        </div>
      </section>

      {/* ========================================================
          4. TOP VERIFIED DOCTORS (PROFESSIONAL SHOWCASE)
      ======================================================== */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold uppercase tracking-widest">
              <UserCheck className="w-3.5 h-3.5 text-teal-700" />
              Verified Board Specialists
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Experienced Home Physicians
            </h2>
            <p className="text-slate-600 text-xs sm:text-base max-w-xl">
              Senior consultants and ICU doctors available for bedside visits and clinical evaluation across Nizamabad.
            </p>
          </div>

          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-teal-800 hover:text-teal-900 uppercase tracking-wider transition-colors shrink-0"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayDoctors.map((doc) => (
            <div
              key={doc._id || doc.name}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm shrink-0">
                    <img
                      src={resolveImageUrl(doc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400')}
                      alt={doc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      On-Duty
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-slate-950 mt-1 leading-tight">
                      {doc.name}
                    </h4>
                    <p className="text-xs font-bold text-teal-800 mt-0.5">
                      {doc.specialty}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 font-semibold">
                  {doc.qualifications} • {doc.experience}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-700 shrink-0" />
                  <span className="truncate font-medium">{doc.availability}</span>
                </div>
              </div>

              <Link
                to="/book"
                state={{ selectService: 'Doctor Consultation' }}
                className="mt-6 w-full py-3 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Book Home Visit</span>
                <ArrowRight className="w-4 h-4 text-teal-200" />
              </Link>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================
          5. CLINICAL RIGOR (4 VALUE PILLARS)
      ======================================================== */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        
        <div className="max-w-2xl mb-8 sm:mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            Safety & Quality Rigor
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Why Nizamabad Families Trust Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LUXURY_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={pillar.title}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-3 text-left shadow-xs hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${pillar.iconBg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-slate-950">
                  {pillar.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================
          6. FAQ ACCORDION (COLLAPSIBLES)
      ======================================================== */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left">
        
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5 text-teal-700" />
            Got Questions?
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {displayFaqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            const questionText = faq.q || faq.question;
            const answerText = faq.a || faq.answer;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-teal-800 transition-colors"
                >
                  <span>{questionText}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-teal-700' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {answerText}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================
          7. CALL TO ACTION BANNER
      ======================================================== */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-14 text-center space-y-6 border border-slate-200 shadow-lg">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-widest border border-teal-200">
            24/7 Clinical Standby Across Nizamabad
          </span>
          <h3 className="text-2xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Need Medical Assistance Right Now?
          </h3>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Submit your care request online or speak with our clinical coordinator directly on WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-2 max-w-md mx-auto">
            <Link
              to="/book"
              className="px-8 py-4 bg-teal-800 hover:bg-teal-900 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <HeartPulse className="w-5 h-5 text-teal-200" />
              <span>Book Care Now</span>
            </Link>

            <a
              href={`https://wa.me/${cleanWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5 text-emerald-100" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
