import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, HeartPulse, Clock, Phone, Award, 
  ArrowRight, CheckCircle2, Sparkles, Star, Users, 
  Activity, Stethoscope, ChevronRight, HelpCircle,
  Truck, Microscope, UserCheck, Check, MessageSquare, ChevronDown,
  MapPin, PhoneCall
} from 'lucide-react';
import { resolveImageUrl } from '../utils/url';

const HOME_SERVICES = [
  {
    id: 'doctor-consultation',
    title: 'Doctor Consultation',
    desc: 'Senior MBBS / MD physicians visit your home in Nizamabad for complete physical examination and diagnosis.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    badge: 'Home Visit',
    tags: ['General Medicine', 'Specialist Visits', 'Post-Op Followup']
  },
  {
    id: 'ambulance-services',
    title: 'Ambulance Services',
    desc: '24/7 Basic Life Support (BLS) and Advanced ICU Ventilator ambulances with emergency paramedics on standby.',
    image: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&q=80&w=600',
    badge: '15-Min Dispatch',
    emergency: true,
    tags: ['Oxygen Support', 'ICU Ventilator', 'Inter-City Transfer']
  },
  {
    id: 'nursing-services',
    title: 'Professional Home Nursing',
    desc: 'Certified ICU and general bedside nurses for 12h / 24h continuous clinical care, wound dressing, and vitals tracking.',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600',
    badge: '12h / 24h Care',
    tags: ['Bedside Care', 'Tracheostomy', 'Injections & IV']
  },
  {
    id: 'icu-setup',
    title: 'ICU Setup at Home',
    desc: 'Complete hospital-grade intensive care unit installed in your bedroom: motorized bed, ventilator, 5-para monitor, and oxygen.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
    badge: 'Hospital-Grade',
    tags: ['Motorized ICU Bed', 'BiPAP / CPAP', 'Multipara Monitor']
  },
  {
    id: 'lab-services',
    title: 'Doorstep Lab Diagnostics',
    desc: 'Certified phlebotomists collect blood & urine samples at your home. NABL certified test reports delivered within 4-6 hours.',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=600',
    badge: 'Doorstep Sample',
    tags: ['Complete Health Panel', 'Cardiac Profile', 'Fast Reports']
  },
  {
    id: 'physiotherapy',
    title: 'Home Physiotherapy',
    desc: 'Licensed physiotherapists for post-surgery joint rehabilitation, neuro-recovery, stroke rehab, and geriatric mobility.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600',
    badge: 'Mobility Rehab',
    tags: ['Stroke Recovery', 'Joint Mobility', 'Pain Relief']
  }
];

const CLINICAL_STANDARDS = [
  {
    title: '100% Certified Clinicians',
    desc: 'Every doctor, nurse, and technician is background-verified with active hospital clinical registration.',
    icon: ShieldCheck
  },
  {
    title: 'Hospital-Grade Bio-Equipment',
    desc: 'Calibrated multipara monitors, Philips / ResMed ventilators, and motorized ICU beds sanitized before every dispatch.',
    icon: Activity
  },
  {
    title: '15-Minute Response Protocol',
    desc: 'Dedicated emergency coordinator hotline in Nizamabad ensures rapid triage and immediate dispatch.',
    icon: Clock
  },
  {
    title: 'Custom Care Protocol',
    desc: 'Individualized treatment plans tailored to each patient’s clinical conditions and doctor prescriptions.',
    icon: CheckCircle2
  }
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Select Service Online',
    desc: 'Choose your medical requirement and submit patient details in under 60 seconds.'
  },
  {
    step: '02',
    title: 'Coordinator Callback',
    desc: 'Our medical team calls you within 15 minutes to review requirements and schedule dispatch.'
  },
  {
    step: '03',
    title: 'Bedside Setup & Care',
    desc: 'Certified clinicians and sterilized hospital equipment arrive at your doorstep in Nizamabad.'
  },
  {
    step: '04',
    title: 'Continuous Monitoring',
    desc: 'Daily medical logs, doctor check-ins, and 24/7 emergency standby support.'
  }
];

const DEFAULT_HOME_FAQS = [
  {
    q: 'How quickly can a doctor or ambulance arrive at our home in Nizamabad?',
    a: 'For emergency ambulance calls and acute triage, dispatch occurs within 15-30 minutes across Nizamabad municipal limits. Scheduled doctor home visits and nursing deployments are arranged at your requested time slot.'
  },
  {
    q: 'Do I need to pay any advance before service starts?',
    a: 'No. Zero advance payment is required for initial coordinator consultations or triage scheduling. Payment is transparently collected only after clinicians or equipment are delivered.'
  },
  {
    q: 'What equipment is included in a complete Home ICU setup?',
    a: 'A complete home ICU setup includes a motorized ICU bed with remote adjustments, critical care ventilator (BiPAP/CPAP/Invasive), 5-para vital signs monitor, suction machine, continuous oxygen concentrator, and a 24/7 ICU-trained bedside nurse.'
  },
  {
    q: 'Are all nurses and technicians certified and background-verified?',
    a: 'Yes. 100% of our clinical personnel possess verified state council registrations (TSMC / Nursing Council), have prior hospital ICU experience, and undergo thorough police background checks.'
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
  const phone = contactSettings?.phoneNumbers?.[0] || "+91 92488 49388";
  const whatsapp = contactSettings?.whatsappNumber || "+91 92488 49388";

  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  const displayFaqs = (faqs && faqs.length > 0) ? faqs : DEFAULT_HOME_FAQS;

  const displayDoctors = (doctors && doctors.length > 0) 
    ? doctors.filter(d => d.isActive !== false).slice(0, 3)
    : [
        {
          _id: 'doc_1',
          name: 'Dr. K. Srinivas Reddy',
          specialty: 'Senior General Physician & Geriatrician',
          qualifications: 'MBBS, MD (General Medicine)',
          experience: '14+ Years Exp',
          image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
          availability: 'Daily (9:00 AM - 1:00 PM & 4:00 PM - 8:00 PM)'
        },
        {
          _id: 'doc_2',
          name: 'Dr. Ananya Sharma',
          specialty: 'Critical Care & ICU Consultant',
          qualifications: 'MBBS, DA, DNB (Critical Care)',
          experience: '10+ Years Exp',
          image: 'https://images.unsplash.com/photo-1594824813689-53b9f4e2f9d6?auto=format&fit=crop&q=80&w=400',
          availability: '24/7 On-Call Standby for Critical Cases'
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

  const scrollToServices = () => {
    const el = document.getElementById('services-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900 relative">
      
      {/* ========================================================
          0. LIVE EMERGENCY DISPATCH TICKER (TOP)
      ======================================================== */}
      <div className="bg-slate-900 text-white py-2 px-4 text-xs font-mono border-b border-slate-800 flex items-center justify-between overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-[11px] text-teal-300 uppercase tracking-widest">
              Live Nizamabad Standby
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-slate-300 text-[11px]">
              BLS & ICU Ventilator Ambulances • Bedside Doctors Active
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-300">
            <span className="flex items-center gap-1 font-bold text-amber-300">
              ⚡ 15-Min Response Protocol
            </span>
            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="font-bold text-white hover:text-teal-300 flex items-center gap-1">
              <PhoneCall className="w-3 h-3" />
              <span>{phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================
          1. HERO SECTION (POLISHED CLEAN 3-ROW HEADLINE)
      ======================================================== */}
      <section className="relative min-h-[82vh] flex flex-col justify-between pt-8 pb-10 lg:pt-12 lg:pb-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center overflow-hidden">
        
        {/* Subtle Tech Grid Texture */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
          style={{
            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} 
        />

        {/* Soft Ambient Radial Background Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[500px] bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Centered Content Container */}
        <div className="relative z-10 space-y-4 sm:space-y-5 my-auto">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-200/90 bg-white/90 backdrop-blur-sm shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700">
              10,000+ Patients Cared • Nizamabad's #1 Home Healthcare
            </span>
          </div>

          {/* Balanced 3-Row Centered Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.12] text-slate-900 uppercase max-w-3xl mx-auto flex flex-col items-center gap-0.5 sm:gap-1">
            <span className="block text-slate-900">Hospital-Grade</span>
            <span className="block text-slate-900">Intensive Care</span>
            <span className="block text-teal-800">
              In Your Home
            </span>
          </h1>

          {/* Descriptive Subtitle */}
          <p className="text-slate-600 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed font-normal px-2">
            Emergency ICU ambulances, 24/7 bedside nursing, home doctor visits, and complete hospital ICU setups delivered across Nizamabad.
          </p>

          {/* Sleek Action Buttons */}
          <div className="pt-1.5 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              to="/book"
              className="w-full sm:w-auto px-7 py-3.5 bg-teal-900 hover:bg-teal-950 active:scale-[0.98] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-teal-950/15 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4 text-teal-300" />
            </Link>

            <button
              type="button"
              onClick={scrollToServices}
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <span>Explore Services</span>
            </button>
          </div>

          {/* Compact 3-Column Stats Container */}
          <div className="pt-2 max-w-lg mx-auto">
            <div className="grid grid-cols-3 divide-x divide-slate-200/90 bg-white/90 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-2xs">
              <div className="px-2 sm:px-4 text-center">
                <span className="text-lg sm:text-2xl font-black text-teal-800 block leading-tight">15 Min</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Fast Response</span>
              </div>
              <div className="px-2 sm:px-4 text-center">
                <span className="text-lg sm:text-2xl font-black text-emerald-700 block leading-tight">100%</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Verified Doctors</span>
              </div>
              <div className="px-2 sm:px-4 text-center">
                <span className="text-lg sm:text-2xl font-black text-amber-600 block leading-tight">4.9 ★</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Patient Rating</span>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll Down Indicator */}
        <div 
          onClick={scrollToServices}
          className="relative z-10 pt-4 flex flex-col items-center justify-center gap-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400">Scroll Down</span>
          <div className="w-4 h-7 rounded-full border-2 border-slate-300 flex items-start justify-center p-0.5">
            <div className="w-1 h-1.5 bg-teal-700 rounded-full animate-bounce" />
          </div>
        </div>

      </section>

      {/* ========================================================
          2. CORE SERVICES SECTION (CLEAN VISUAL TOUCH CARDS)
      ======================================================== */}
      <section id="services-section" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-teal-100 bg-teal-50 text-teal-800 text-xs font-black uppercase tracking-widest">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            Specialized Home Medical Services
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Services Available in Nizamabad
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Select what you need. Our clinical team will contact you back immediately to coordinate setup.
          </p>
        </div>

        {/* Visual Touch Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {HOME_SERVICES.map((serv) => (
            <div 
              key={serv.id}
              className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[340px] sm:min-h-[380px] p-5 sm:p-6"
            >
              {/* Background Photo */}
              <img 
                src={serv.image} 
                alt={serv.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-0 opacity-75"
              />

              {/* Dark Gradient Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40 z-10" />

              {/* Top Badge Overlay */}
              <div className="relative z-20 flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md border ${
                  serv.emergency 
                    ? 'bg-rose-500/20 text-rose-200 border-rose-400/30' 
                    : 'bg-teal-500/20 text-teal-200 border-teal-400/30'
                }`}>
                  {serv.badge}
                </span>
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/15">
                  Nizamabad
                </span>
              </div>

              {/* Bottom Content & Request Care Button */}
              <div className="relative z-20 space-y-3 pt-16">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md">
                    {serv.title}
                  </h3>
                  <p className="text-slate-300 text-xs mt-1.5 line-clamp-2 leading-relaxed font-normal">
                    {serv.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {serv.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-bold bg-white/15 backdrop-blur-md text-slate-200 px-2 py-0.5 rounded border border-white/15">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  to="/book"
                  state={{ selectService: serv.title }}
                  className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-3"
                >
                  <span>Book Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================
          3. TOP DOCTORS SPOTLIGHT (VERSION 2.0 SHOWCASE)
      ======================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-teal-100 bg-teal-50 text-teal-800 text-xs font-black uppercase tracking-widest">
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              Verified Board Specialists
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Experienced Home Physicians
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-xl">
              Senior consultants and ICU doctors available for home visits, diagnostic evaluations, and bedside recovery oversight.
            </p>
          </div>

          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-xs font-bold text-teal-800 hover:text-teal-950 uppercase tracking-wider shrink-0 transition-colors"
          >
            <span>View All Clinicians</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {displayDoctors.map((doc) => (
            <div
              key={doc._id || doc.name}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={resolveImageUrl(doc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400')}
                      alt={doc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      On-Duty
                    </span>
                    <h4 className="text-sm font-black text-slate-900 mt-1 leading-tight">
                      {doc.name}
                    </h4>
                    <p className="text-[11px] text-teal-800 font-bold mt-0.5">
                      {doc.specialty}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-medium">
                  {doc.qualifications} • {doc.experience}
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[10px] text-slate-600 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-teal-700 shrink-0" />
                  <span className="truncate">{doc.availability}</span>
                </div>
              </div>

              <Link
                to="/book"
                state={{ selectService: 'Doctor Consultation' }}
                className="mt-5 w-full py-2.5 bg-slate-100 hover:bg-teal-900 hover:text-white text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span>Book Home Visit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================
          4. CLINICAL RIGOR & QUALITY STANDARDS
      ======================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Safety & Quality Standards
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why Nizamabad Trusts Us
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Hospital-grade sterile protocols engineered for patient safety in home environments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
          {CLINICAL_STANDARDS.map((std) => {
            const Icon = std.icon;
            return (
              <div 
                key={std.title}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mb-4 border border-teal-100">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-slate-900 mb-1.5">
                  {std.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {std.desc}
                </p>
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================
          5. HOW IT WORKS (4 SIMPLE STEPS)
      ======================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-teal-100 bg-teal-50 text-teal-800 text-xs font-black uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            Simple 4-Step Process
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How Home Healthcare Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
          {PROCESS_STEPS.map((step) => (
            <div 
              key={step.step}
              className="bg-white p-6 rounded-3xl border border-slate-200/70 relative group hover:border-teal-700/30 transition-all shadow-xs"
            >
              <span className="text-3xl font-black text-teal-200 group-hover:text-teal-700 transition-colors block mb-2">
                {step.step}
              </span>
              <h4 className="text-sm font-black text-slate-900 mb-1">
                {step.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================
          6. FAQ ACCORDION (VERSION 2.0 COLLAPSIBLES)
      ======================================================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-100 text-left">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-teal-100 bg-teal-50 text-teal-800 text-xs font-black uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            Got Questions?
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
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
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-xs sm:text-sm text-slate-900 hover:text-teal-900 transition-colors"
                >
                  <span>{questionText}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-teal-700' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {answerText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          7. CALL TO ACTION BANNER (CLEAN LIGHT MEDICAL THEME)
      ======================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-b from-teal-50/70 to-white border border-teal-100 rounded-3xl p-8 sm:p-12 shadow-[0_15px_40px_rgba(15,23,42,0.04)] space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-teal-100/80 text-teal-900 rounded-full text-xs font-black uppercase tracking-widest border border-teal-200">
            24/7 Standby Support Across Nizamabad
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Need Medical Assistance Right Now?
          </h2>
          <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto font-medium leading-relaxed">
            Submit your care request online or speak with our medical coordination desk directly on WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 max-w-md mx-auto pt-2">
            <Link
              to="/book"
              className="w-full py-4 px-8 bg-teal-900 hover:bg-teal-950 active:scale-[0.98] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-teal-950/20 transition-all flex items-center justify-center gap-2"
            >
              <HeartPulse className="w-4 h-4 text-teal-300" />
              <span>Book Appointment</span>
            </Link>
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-8 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-100" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
