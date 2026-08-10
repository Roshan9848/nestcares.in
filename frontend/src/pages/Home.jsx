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
    <div className="bg-[#0b1319] min-h-screen text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950">
      
      {/* ========================================================
          1. HERO SECTION (FOCUSED, CLEAN, LUXURY MOBILE STRUCTURE)
      ======================================================== */}
      <section className="relative min-h-[92vh] flex flex-col justify-between pt-10 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center overflow-hidden">
        
        {/* Soft Ambient Radial Background Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-to-b from-teal-500/15 to-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Top Content Block */}
        <div className="space-y-6 sm:space-y-8 my-auto">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-950/40 backdrop-blur-md shadow-lg shadow-teal-950/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-teal-300">
              10,000+ Patients Cared • Nizamabad Healthcare
            </span>
          </div>

          {/* Bold Impact Headline */}
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-[1.08] text-white">
              Hospital-Grade Care
            </h1>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-[1.08] text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">
              Directly in Your Home
            </h2>
          </div>

          {/* Clean Subtitle for Patient/Family */}
          <p className="text-slate-300 text-xs sm:text-base max-w-xl mx-auto leading-relaxed font-normal px-2">
            Emergency ICU ambulances, 24/7 bedside nursing, home doctor visits, and complete hospital ICU setups delivered to your doorstep in Nizamabad.
          </p>

          {/* Two Big Stacked Mobile Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 max-w-md mx-auto">
            <Link
              to="/book"
              className="w-full py-4 px-8 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 active:scale-[0.98] text-slate-950 text-xs sm:text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <HeartPulse className="w-4 h-4 text-slate-950" />
              <span>Book Healthcare Service</span>
            </Link>

            <button
              type="button"
              onClick={scrollToServices}
              className="w-full py-4 px-8 bg-white/5 hover:bg-white/10 active:scale-[0.98] text-white text-xs sm:text-sm font-bold uppercase tracking-widest rounded-2xl border border-white/15 backdrop-blur-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Explore All Treatments</span>
            </button>
          </div>

          {/* Unified 3-Column Stats Container */}
          <div className="pt-4 max-w-lg mx-auto">
            <div className="grid grid-cols-3 divide-x divide-white/10 bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg">
              <div className="px-2 text-center">
                <span className="text-xl sm:text-2xl font-black text-teal-400 block leading-tight">15 Min</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Fast Response</span>
              </div>
              <div className="px-2 text-center">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 block leading-tight">100%</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Verified Staff</span>
              </div>
              <div className="px-2 text-center">
                <span className="text-xl sm:text-2xl font-black text-amber-400 block leading-tight">4.9 ★</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Patient Rating</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Scroll Indicator */}
        <div className="pt-6 flex flex-col items-center justify-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Scroll Down</span>
          <div className="w-5 h-8 rounded-full border-2 border-slate-500 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-teal-400 rounded-full animate-bounce" />
          </div>
        </div>

      </section>

      {/* ========================================================
          2. CORE SERVICES SECTION (CLEAN VISUAL TOUCH CARDS)
      ======================================================== */}
      <section id="services-section" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-teal-500/20 bg-teal-950/30 text-teal-300 text-xs font-black uppercase tracking-widest">
            <Stethoscope className="w-3.5 h-3.5" />
            Specialized Home Medical Services
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Services Available in Nizamabad
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Select what you need. Our clinical team will contact you back immediately to coordinate setup.
          </p>
        </div>

        {/* Visual Touch Cards Grid (1 col on mobile, 2 on tablet, 3 on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {HOME_SERVICES.map((serv) => (
            <div 
              key={serv.id}
              className="group relative rounded-3xl overflow-hidden bg-slate-900/80 border border-white/10 hover:border-teal-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[340px] sm:min-h-[380px] p-5 sm:p-6"
            >
              {/* Background Photo */}
              <img 
                src={serv.image} 
                alt={serv.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-0 opacity-60"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1319] via-[#0b1319]/80 to-[#0b1319]/30 z-10" />

              {/* Top Badge Overlay */}
              <div className="relative z-20 flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md border ${
                  serv.emergency 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-400/30' 
                    : 'bg-teal-500/20 text-teal-300 border-teal-400/30'
                }`}>
                  {serv.badge}
                </span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10">
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
                    <span key={tag} className="text-[9px] font-bold bg-white/10 backdrop-blur-md text-slate-300 px-2 py-0.5 rounded border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  to="/book"
                  state={{ selectService: serv.title }}
                  className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-3"
                >
                  <span>Request Care</span>
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
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-950/30 text-emerald-300 text-xs font-black uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            Safety & Quality Standards
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Why Nizamabad Trusts Us
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Hospital-grade sterile protocols engineered for patient safety in home environments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
          {CLINICAL_STANDARDS.map((std) => {
            const Icon = std.icon;
            return (
              <div 
                key={std.title}
                className="bg-white/[0.03] hover:bg-white/[0.06] p-6 rounded-3xl border border-white/10 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 border border-teal-500/20">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-white mb-1.5">
                  {std.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
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
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-teal-500/20 bg-teal-950/30 text-teal-300 text-xs font-black uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5" />
            Simple 4-Step Process
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
            How Home Healthcare Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
          {PROCESS_STEPS.map((step) => (
            <div 
              key={step.step}
              className="bg-white/[0.03] p-6 rounded-3xl border border-white/10 relative group hover:border-teal-500/40 transition-all"
            >
              <span className="text-3xl font-black text-teal-500/40 group-hover:text-teal-400 transition-colors block mb-2">
                {step.step}
              </span>
              <h4 className="text-sm font-black text-white mb-1">
                {step.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================
          5. CALL TO ACTION FOOTER BANNER
      ======================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6 border-t border-white/5">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/10 text-teal-300 rounded-full text-xs font-bold uppercase tracking-widest">
          24/7 Standby Support Across Nizamabad
        </span>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight uppercase">
          Need Medical Assistance Right Now?
        </h2>
        <p className="text-slate-400 text-xs sm:text-base max-w-xl mx-auto">
          Submit your care request online or speak with our medical coordination desk directly on WhatsApp.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 max-w-md mx-auto pt-2">
          <Link
            to="/book"
            className="w-full py-4 px-8 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all"
          >
            Request Care Appointment
          </Link>
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-8 bg-white/10 hover:bg-white/15 text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </section>

    </div>
  );
};

export default Home;
