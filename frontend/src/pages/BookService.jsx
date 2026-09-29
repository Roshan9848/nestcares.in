import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, PhoneCall, Clock, Award, 
  Sparkles, CheckCircle2, MessageSquare, ArrowLeft
} from 'lucide-react';
import BookingForm from '../components/BookingForm';

const BookService = ({ services }) => {
  const location = useLocation();
  const preSelectedService = location.state?.selectService || '';
  const preSelectedSubService = location.state?.selectSubService || '';
  const preSelectedMobile = location.state?.quickMobile || '';
  const preSelectedAddress = location.state?.quickArea ? `${location.state.quickArea}, Nizamabad` : '';

  useEffect(() => {
    document.title = "Book Home Healthcare Services in Nizamabad | Nest Cares";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Background ambient accents */}
      <div className="max-w-5xl mx-auto mb-8 text-left">
        <Link 
          to="/services"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors uppercase tracking-wider mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Medical Services</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3 bg-teal-50 text-teal-700 border border-teal-200">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Verified Nizamabad Home Healthcare
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Book Home Medical Care
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed font-normal">
              Transparent standard pricing, certified ICU & nursing clinicians, and guaranteed rapid dispatch across Nizamabad.
            </p>
          </div>

          <div className="flex items-center gap-3 glass-card-premium p-4 rounded-2xl border border-slate-200/80 bg-white shadow-sm shrink-0">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-black border border-teal-100">
              24/7
            </div>
            <div className="text-left">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Standby Helpline</span>
              <a href="tel:+919248849388" className="text-xs font-black text-teal-700 hover:text-teal-800 transition-colors">
                +91 92488 49388
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Unified Booking Form */}
      <div className="max-w-5xl mx-auto">
        <BookingForm 
          services={services} 
          preSelectedCategory={preSelectedService}
          preSelectedSubService={preSelectedSubService}
          preSelectedMobile={preSelectedMobile}
          preSelectedAddress={preSelectedAddress}
        />
      </div>

      {/* Trust & Guarantee Strip */}
      <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="glass-card-premium p-5 rounded-3xl border border-slate-200/80 bg-white shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">Zero Advance Required</h4>
            <p className="text-xs text-slate-600 mt-0.5">Pay only after clinical setup and home service delivery is completed.</p>
          </div>
        </div>

        <div className="glass-card-premium p-5 rounded-3xl border border-slate-200/80 bg-white shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 bg-teal-50 text-teal-700 rounded-2xl border border-teal-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">Certified Medical Staff</h4>
            <p className="text-xs text-slate-600 mt-0.5">100% verified doctors, nurses, and technicians with intensive care experience.</p>
          </div>
        </div>

        <div className="glass-card-premium p-5 rounded-3xl border border-slate-200/80 bg-white shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 bg-sky-50 text-sky-700 rounded-2xl border border-sky-100">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">15-Minute Callback</h4>
            <p className="text-xs text-slate-600 mt-0.5">Rapid triage and medical dispatch coordination across Nizamabad.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;
