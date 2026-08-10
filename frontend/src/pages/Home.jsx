import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, HeartPulse, Clock, Phone, Award, 
  ArrowRight, CheckCircle2, Sparkles, Star, Users, 
  Activity, Stethoscope, ChevronRight, HelpCircle,
  Truck, Microscope, UserCheck, Check, MessageSquare
} from 'lucide-react';

const HOME_SERVICES = [
  {
    id: 'doctor-consultation',
    title: 'Doctor Consultation',
    desc: 'Senior MBBS / MD physicians visit your home in Nizamabad for comprehensive bedside diagnostics and treatment protocols.',
    icon: '🩺',
    badge: 'Same-Day Visit',
    popular: true,
    tags: ['General Medicine', 'Specialist Visits', 'Post-Op Followup']
  },
  {
    id: 'ambulance-services',
    title: 'Ambulance Services',
    desc: '24/7 Basic Life Support (BLS) and Advanced ICU Ventilator ambulances with emergency paramedics on standby.',
    icon: '🚑',
    badge: '15-Min Dispatch',
    emergency: true,
    tags: ['Oxygen Support', 'ICU Ventilator', 'Inter-City Transfer']
  },
  {
    id: 'nursing-services',
    title: 'Professional Home Nursing',
    desc: 'Certified ICU and general bedside nurses for 12h / 24h continuous clinical care, wound dressing, and vitals tracking.',
    icon: '👩‍⚕️',
    badge: '12h / 24h Shifts',
    popular: true,
    tags: ['Bedside Care', 'Tracheostomy', 'Injections & IV']
  },
  {
    id: 'icu-setup',
    title: 'ICU Setup at Home',
    desc: 'Complete hospital-grade intensive care unit installed in your bedroom: motorized bed, ventilator, 5-para monitor, and oxygen.',
    icon: '🏥',
    badge: 'Hospital-Grade',
    tags: ['Motorized ICU Bed', 'BiPAP / CPAP', 'Multipara Monitor']
  },
  {
    id: 'lab-services',
    title: 'Doorstep Lab Diagnostics',
    desc: 'Certified phlebotomists collect blood & urine samples at your home. NABL certified test reports delivered within 4-6 hours.',
    icon: '🔬',
    badge: 'NABL Certified',
    tags: ['Complete Health Panel', 'Cardiac Profile', 'Fast Reports']
  },
  {
    id: 'physiotherapy',
    title: 'Home Physiotherapy',
    desc: 'Licensed physiotherapists for post-surgery joint rehabilitation, neuro-recovery, stroke rehab, and geriatric mobility.',
    icon: '💪',
    badge: 'Targeted Rehab',
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
    desc: 'Choose your medical category and submit patient details in under 60 seconds.'
  },
  {
    step: '02',
    title: 'Coordinator Callback',
    desc: 'Our senior healthcare team calls you immediately to understand patient requirements.'
  },
  {
    step: '03',
    title: 'Bedside Setup & Dispatch',
    desc: 'Certified clinicians and sterilized hospital equipment arrive at your home promptly.'
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

  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* ========================================================
          1. HERO SECTION (CENTERED, MINIMALIST & MODERN 2026)
      ======================================================== */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden bg-gradient-to-b from-teal-950/5 via-[#fafafb] to-[#fafafb]">
        
        {/* Soft Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-teal-500/10 via-emerald-500/5 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Centered Top Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-1.5 bg-white border border-slate-200/80 rounded-full shadow-xs mb-8">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-teal-900 text-teal-100 rounded-full text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-teal-300" />
              Nizamabad
            </span>
            <span className="text-xs font-bold text-slate-700">#1 Home Healthcare Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              24/7 Standby Active
            </span>
          </div>

          {/* Centered High-Impact Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Hospital-Grade <span className="text-teal-800 underline decoration-teal-500/30 decoration-wavy decoration-2">Intensive Care</span> Directly in Your Home.
          </h1>

          {/* Centered Subtitle */}
          <p className="text-slate-600 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mt-6 leading-relaxed font-normal">
            Emergency ICU ambulances, 24/7 bedside nursing, home doctor visits, and complete hospital ICU setups delivered across Nizamabad.
          </p>

          {/* Centered Action Buttons */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <Link
              to="/book"
              className="w-full sm:w-auto px-8 py-4 bg-teal-900 hover:bg-teal-950 active:scale-[0.98] text-white text-xs font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-teal-950/20 transition-all hover:-translate-y-0.5"
            >
              <HeartPulse className="w-4 h-4 text-teal-300" />
              <span>Request Healthcare Service</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`tel:${phone}`}
              className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 text-slate-900 text-xs font-black uppercase tracking-widest rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>24/7 Helpline: {phone}</span>
            </a>
          </div>

          {/* Centered Key Trust Metrics Strip */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xl font-black text-slate-900 block">15 Min</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 block">Fast Callback</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xl font-black text-emerald-700 block">100%</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 block">Verified Doctors</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xl font-black text-teal-800 block">Hospital</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 block">Grade Equipment</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xl font-black text-amber-600 block">4.9 ★</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 block">Patient Rating</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          2. CORE SERVICES SECTION
      ======================================================== */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-800 rounded-full text-xs font-black uppercase tracking-widest border border-teal-100">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              Comprehensive Care Offerings
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Hospital Services in Your Bedroom
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Select what you need below. Our medical team will call you back to confirm details and dispatch clinicians.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOME_SERVICES.map((serv) => (
              <div 
                key={serv.id}
                className="bg-[#fafafb] hover:bg-white rounded-3xl border border-slate-200/80 hover:border-teal-700/30 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-left"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className="text-3xl p-3 bg-white rounded-2xl border border-slate-200/60 shadow-xs group-hover:scale-110 transition-transform">
                      {serv.icon}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                      serv.emergency 
                        ? 'bg-rose-50 text-rose-800 border-rose-200' 
                        : 'bg-teal-50 text-teal-800 border-teal-200'
                    }`}>
                      {serv.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-900 transition-colors">
                    {serv.title}
                  </h3>

                  <p className="text-slate-600 text-xs mt-2 line-clamp-3 leading-relaxed font-normal">
                    {serv.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {serv.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider block">Requirement Type</span>
                    <span className="text-xs font-bold text-slate-800">Home Dispatch</span>
                  </div>

                  <Link
                    to="/book"
                    state={{ selectService: serv.title }}
                    className="px-4 py-2.5 bg-teal-900 group-hover:bg-teal-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Request Care</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          3. CLINICAL RIGOR & STANDARDS
      ======================================================== */}
      <section className="py-20 bg-[#fafafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Patient Safety & Quality Guarantee
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Why Nizamabad Families Trust Nest Cares
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Every detail is engineered to match the safety standards of a modern multispecialty hospital.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {CLINICAL_STANDARDS.map((std) => {
              const Icon = std.icon;
              return (
                <div 
                  key={std.title}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mb-2">
                    {std.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {std.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================
          4. HOW IT WORKS (SIMPLE 4-STEP PROCESS)
      ======================================================== */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-800 rounded-full text-xs font-black uppercase tracking-widest border border-teal-100">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              Streamlined Clinical Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How Home Healthcare Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left relative">
            {PROCESS_STEPS.map((step) => (
              <div 
                key={step.step}
                className="bg-[#fafafb] p-6 rounded-3xl border border-slate-200/60 relative group hover:bg-white hover:shadow-lg transition-all"
              >
                <span className="text-3xl font-black text-teal-200 group-hover:text-teal-600 transition-colors block mb-3">
                  {step.step}
                </span>
                <h4 className="text-sm font-black text-slate-900 mb-1.5">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          5. CALL TO ACTION FOOTER BANNER
      ======================================================== */}
      <section className="py-16 bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/10 text-teal-300 rounded-full text-xs font-bold uppercase tracking-widest">
            24/7 Standby Support Across Nizamabad
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Need Medical Assistance Right Now?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Submit your care request online or contact our medical desk directly on WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/book"
              className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all hover:-translate-y-0.5"
            >
              Request Care Appointment
            </Link>
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
