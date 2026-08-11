import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, HeartPulse, Clock, Phone, Award, 
  ArrowRight, CheckCircle2, Sparkles, Star, Users, 
  Activity, Stethoscope, ChevronRight, HelpCircle,
  Truck, Microscope, UserCheck, Check, MessageSquare, ChevronDown,
  MapPin, PlusCircle, ArrowUpRight
} from 'lucide-react';

const HOME_SERVICES = [
  {
    num: '01',
    id: 'doctor-consultation',
    title: 'Doctor Consultation',
    desc: 'Senior MBBS / MD physicians visit your home in Nizamabad for complete bedside physical diagnostics and prescriptions.',
    badge: 'Home Visit',
    tags: ['General Medicine', 'Specialist Visits', 'Post-Op Followup']
  },
  {
    num: '02',
    id: 'ambulance-services',
    title: 'Ambulance Services',
    desc: '24/7 Basic Life Support (BLS) and Advanced ICU Ventilator ambulances with emergency paramedics on standby.',
    badge: '15-Min Dispatch',
    emergency: true,
    tags: ['Oxygen Support', 'ICU Ventilator', 'Inter-City Transfer']
  },
  {
    num: '03',
    id: 'nursing-services',
    title: 'Professional Home Nursing',
    desc: 'Certified ICU and general bedside nurses for 12h / 24h continuous clinical care, wound dressing, and vitals tracking.',
    badge: '12h / 24h Care',
    tags: ['Bedside Care', 'Tracheostomy', 'Injections & IV']
  },
  {
    num: '04',
    id: 'icu-setup',
    title: 'ICU Setup at Home',
    desc: 'Complete hospital-grade intensive care unit installed in your bedroom: motorized bed, ventilator, 5-para monitor, and oxygen.',
    badge: 'Hospital-Grade',
    tags: ['Motorized ICU Bed', 'BiPAP / CPAP', 'Multipara Monitor']
  },
  {
    num: '05',
    id: 'lab-services',
    title: 'Doorstep Lab Diagnostics',
    desc: 'Certified phlebotomists collect blood & urine samples at your home. NABL certified test reports delivered within 4-6 hours.',
    badge: 'Doorstep Sample',
    tags: ['Complete Health Panel', 'Cardiac Profile', 'Fast Reports']
  },
  {
    num: '06',
    id: 'physiotherapy',
    title: 'Home Physiotherapy',
    desc: 'Licensed physiotherapists for post-surgery joint rehabilitation, neuro-recovery, stroke rehab, and geriatric mobility.',
    badge: 'Mobility Rehab',
    tags: ['Stroke Recovery', 'Joint Mobility', 'Pain Relief']
  }
];

const TICKER_ITEMS = [
  { icon: '🩺', label: 'Doctor Home Visits' },
  { icon: '🚑', label: 'Emergency ICU Ambulance' },
  { icon: '👩‍⚕️', label: '24/7 Bedside Nursing' },
  { icon: '🏥', label: 'Complete Home ICU Setup' },
  { icon: '🔬', label: 'Doorstep Lab Diagnostics' },
  { icon: '💪', label: 'Physiotherapy Rehabilitation' },
  { icon: '🍎', label: 'Dietician Advisory' }
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
    <div className="bg-[#fafafb] min-h-screen text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900 relative">
      
      {/* ========================================================
          1. HERO SECTION (INSPIRED BY AWS SBG ARCHITECTURE)
      ======================================================== */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center pt-8 pb-14 px-4 sm:px-6 relative overflow-hidden text-center">
        
        {/* Subtle Tech Grid Texture */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.035] pointer-events-none" 
          style={{
            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} 
        />

        {/* Ambient Glowing Floating Orbs */}
        <div className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full bg-teal-500/10 blur-[100px] anim-float pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-64 h-64 rounded-full bg-emerald-500/10 blur-[100px] anim-float pointer-events-none" style={{ animationDelay: '-2s' }} />

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Top Pill Badges */}
          <div className="flex flex-col items-center gap-2 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 bg-slate-900/[0.04] border border-slate-900/10 rounded-full px-4 py-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono font-bold text-[10px] sm:text-xs uppercase tracking-widest text-slate-800">
                Nest Cares Home Healthcare
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px] sm:text-xs uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5 text-teal-700" />
              <span>Nizamabad, Telangana • 24/7 Standby Active</span>
            </div>
          </div>

          {/* Hero Headline with Clean Scale & Hollow Accent */}
          <h1 className="font-sans font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight leading-[0.95] text-slate-900 m-0 flex flex-col items-center relative">
            <span className="inline-block">Hospital-Grade</span>
            <span className="text-hollow inline-block">Intensive Care.</span>
            <div className="absolute -top-3 right-0 sm:-right-4 bg-teal-50 border border-teal-200 text-teal-800 text-[9px] sm:text-[10px] font-mono px-2.5 py-0.5 uppercase tracking-widest font-bold rounded-full rotate-12 shadow-xs">
              24/7 Care
            </div>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 sm:mt-8 max-w-xl text-xs sm:text-base font-mono text-slate-600 px-2 leading-relaxed">
            We deploy emergency ICU ambulances, 24/7 bedside nursing, home doctor visits, and complete hospital ICU setups delivered to your doorstep.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-8 sm:mt-10 mb-8 max-w-md w-full sm:w-auto">
            <Link
              to="/book"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 font-mono font-bold text-white bg-teal-900 hover:bg-teal-950 uppercase tracking-widest overflow-hidden transition-all hover:scale-105 rounded-xl gap-2 text-xs sm:text-sm shadow-md"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4 text-teal-300" />
            </Link>

            <button
              type="button"
              onClick={scrollToServices}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 font-mono font-bold text-slate-800 uppercase tracking-widest text-xs sm:text-sm rounded-xl border border-slate-300 hover:border-teal-700 hover:text-teal-800 bg-white transition-all"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </section>

      {/* ========================================================
          2. CONTINUOUS INFINITE TICKER MARQUEE
      ======================================================== */}
      <section className="py-4 relative bg-slate-900 text-white overflow-hidden border-y border-slate-800">
        <div className="anim-marquee flex items-center">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
            <React.Fragment key={index}>
              <span className="mx-6 flex items-center gap-3 font-mono text-xs sm:text-sm uppercase tracking-wider font-bold text-slate-200 shrink-0">
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </span>
              <span className="text-teal-400 font-bold">•</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ========================================================
          3. MISSION & STANDARDS (SPLIT 2-COLUMN SECTION)
      ======================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          <div className="md:col-span-5 flex flex-col justify-center text-left">
            <span className="font-mono text-teal-800 font-bold uppercase tracking-widest mb-3 block text-xs">
              &gt; Our Mission
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.05] text-slate-900">
              Hospital Rigor <span className="text-hollow">In Your</span> Bedroom.
            </h2>
          </div>

          <div className="md:col-span-7 flex flex-col justify-center font-mono text-xs sm:text-sm leading-relaxed text-slate-600 space-y-6 text-left">
            <p>
              Nest Cares brings the clinical infrastructure of a multispecialty hospital directly to private residences in Nizamabad. We eliminate the stress of repeated hospital trips by deploying verified MBBS physicians, ICU-registered bedside nurses, and sanitized medical equipment straight to your home.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 mb-1">10,000+</div>
                <div className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-teal-800">Patients Cared</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 mb-1">15 Min</div>
                <div className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-teal-800">Response Protocol</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          4. WHAT WE PROVIDE (STRUCTURED 3-COLUMN SERVICE CARDS)
      ======================================================== */}
      <section id="services-section" className="py-16 sm:py-24 bg-slate-900 text-white px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="font-mono text-teal-400 text-xs font-bold uppercase tracking-widest block mb-2">
                &gt; Care Catalog
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-none text-white">
                What We <span className="text-teal-400">Deliver</span>
              </h2>
            </div>
            <Link
              to="/services"
              className="font-mono text-xs font-bold uppercase tracking-widest text-teal-300 hover:text-white flex items-center gap-1.5"
            >
              <span>View Full Directory</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {HOME_SERVICES.map((serv) => (
              <div 
                key={serv.id}
                className="group relative border border-white/10 rounded-2xl p-6 hover:bg-white hover:text-slate-900 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-white/10 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      {serv.badge}
                    </span>
                    <span className="font-mono font-black text-2xl text-white/30 group-hover:text-teal-800 transition-colors">
                      {serv.num}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-2 text-white group-hover:text-slate-900 transition-colors">
                    {serv.title}
                  </h3>

                  <p className="font-mono text-xs leading-relaxed text-slate-400 group-hover:text-slate-600 transition-colors mb-6">
                    {serv.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 group-hover:border-slate-200 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {serv.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 group-hover:bg-slate-100 text-slate-300 group-hover:text-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/book"
                    state={{ selectService: serv.title }}
                    className="p-2 rounded-lg bg-teal-500 group-hover:bg-slate-900 text-slate-950 group-hover:text-white transition-colors flex items-center justify-center shrink-0 ml-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          5. READY TO RECEIVE CARE? (CALL TO ACTION)
      ======================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-teal-100 text-teal-800 rounded-2xl mb-8 flex items-center justify-center anim-float shadow-md">
          <HeartPulse className="w-8 h-8" />
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-4 text-slate-900">
          Ready For <br />
          <span className="text-hollow">Home Care?</span>
        </h2>

        <p className="font-mono text-xs sm:text-sm text-slate-600 mb-8 max-w-md leading-relaxed">
          Submit your care request online or speak directly with our Nizamabad coordination desk on WhatsApp.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3.5 max-w-md w-full sm:w-auto">
          <Link
            to="/book"
            className="w-full sm:w-auto px-8 py-4 font-mono font-bold text-white bg-teal-900 hover:bg-teal-950 uppercase tracking-widest rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105"
          >
            <span>Book Appointment</span>
            <ArrowRight className="w-4 h-4 text-teal-300" />
          </Link>

          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 font-mono font-bold text-slate-800 uppercase tracking-widest text-xs sm:text-sm rounded-xl border border-slate-300 hover:border-emerald-600 hover:text-emerald-700 bg-white transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Desk</span>
          </a>
        </div>
      </section>

    </div>
  );
};

export default Home;
