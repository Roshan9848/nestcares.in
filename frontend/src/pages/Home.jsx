import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, HeartPulse, Clock, Phone, Award, 
  ArrowRight, CheckCircle2, Sparkles, Star, Users, 
  Activity, Stethoscope, ChevronRight, HelpCircle,
  Truck, Microscope, UserCheck, Check, MessageSquare, ChevronDown
} from 'lucide-react';

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

const Home = ({ 
  services = [], 
  testimonials = [], 
  faqs = [], 
  webSettings, 
  contactSettings 
}) => {
  const phone = contactSettings?.phoneNumbers?.[0] || "+91 92488 49388";
  const whatsapp = contactSettings?.whatsappNumber || "+91 92488 49388";

  const scrollToServices = () => {
    const el = document.getElementById('services-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* ========================================================
          1. HERO SECTION (CLEAN 3-ROW CENTERED IMPACT HEADLINE)
      ======================================================== */}
      <section className="relative min-h-[85vh] flex flex-col justify-between pt-10 pb-12 lg:pt-16 lg:pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center overflow-hidden">
        
        {/* Soft Ambient Radial Background Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[600px] bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

        {/* Centered Content Container */}
        <div className="space-y-6 sm:space-y-7 my-auto">
          
          {/* 1. Top Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-slate-200/90 bg-white shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-700">
              10,000+ Patients Cared • Nizamabad's #1 Home Healthcare
            </span>
          </div>

          {/* 2. 3-Row Centered Clean Impact Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-slate-900 uppercase max-w-4xl mx-auto flex flex-col items-center gap-1 sm:gap-1.5">
            <span className="block">Hospital-Grade</span>
            <span className="block">Intensive Care</span>
            <span className="block text-teal-800">
              In Your Home
            </span>
          </h1>

          {/* 3. Clean Descriptive Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed font-normal px-2">
            Emergency ICU ambulances, 24/7 bedside nursing, home doctor visits, and complete hospital ICU setups delivered to your doorstep across Nizamabad.
          </p>

          {/* 4. Unified Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 max-w-md mx-auto">
            <Link
              to="/book"
              className="px-8 py-4 bg-teal-900 hover:bg-teal-950 active:scale-[0.98] text-white text-xs sm:text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-teal-950/20 flex items-center justify-center gap-2.5 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4 text-teal-300" />
            </Link>

            <button
              type="button"
              onClick={scrollToServices}
              className="px-8 py-4 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 text-xs sm:text-sm font-bold uppercase tracking-widest rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore Services</span>
            </button>
          </div>

          {/* 5. Unified 3-Column Stats Container */}
          <div className="pt-3 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 divide-x divide-slate-200/90 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="px-3 sm:px-6 text-center">
                <span className="text-xl sm:text-3xl font-black text-teal-800 block leading-tight">15 Min</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider block mt-1">Fast Response</span>
              </div>
              <div className="px-3 sm:px-6 text-center">
                <span className="text-xl sm:text-3xl font-black text-emerald-700 block leading-tight">100%</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider block mt-1">Verified Doctors</span>
              </div>
              <div className="px-3 sm:px-6 text-center">
                <span className="text-xl sm:text-3xl font-black text-amber-600 block leading-tight">4.9 ★</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider block mt-1">Patient Rating</span>
              </div>
            </div>
          </div>

        </div>

        {/* 6. Scroll Down Indicator */}
        <div 
          onClick={scrollToServices}
          className="pt-6 flex flex-col items-center justify-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">Scroll Down</span>
          <div className="w-5 h-8 rounded-full border-2 border-slate-300 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-teal-700 rounded-full animate-bounce" />
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

        {/* Visual Touch Cards Grid (1 col on mobile, 2 on tablet, 3 on desktop) */}
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
          3. CLINICAL RIGOR & QUALITY STANDARDS
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
          4. HOW IT WORKS (4 SIMPLE STEPS)
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
          5. CALL TO ACTION BANNER (CLEAN LIGHT MEDICAL THEME)
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
