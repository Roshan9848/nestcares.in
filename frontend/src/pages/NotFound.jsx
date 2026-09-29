import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight, PhoneCall, Stethoscope, Sparkles } from 'lucide-react';

const NotFound = () => {
  useEffect(() => {
    document.title = "404 - Page Not Found | Nest Cares Home Healthcare";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-[#fafafb] font-sans">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10 text-center space-y-6">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Nest Cares Nizamabad</span>
        </div>

        {/* 404 Visual Number */}
        <div className="space-y-2">
          <div className="text-6xl sm:text-7xl font-black text-teal-900 tracking-tighter">
            404
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Medical Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            The page you are looking for might have been moved, updated, or does not exist. Our 24/7 home care services are fully available.
          </p>
        </div>

        {/* Quick Help Strip */}
        <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl flex items-center justify-between text-left">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Need Urgent Assistance?</span>
            <span className="text-xs font-black text-slate-900">+91 92488 49388 (24/7 Helpline)</span>
          </div>
          <a
            href="tel:+919248849388"
            className="p-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl transition-colors shadow-sm"
            title="Call Standby Helpline"
          >
            <PhoneCall className="w-4 h-4" />
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full py-3.5 px-6 bg-teal-900 hover:bg-teal-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Home className="w-4 h-4 text-teal-300" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/services"
            className="w-full py-3.5 px-6 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs"
          >
            <Stethoscope className="w-4 h-4 text-teal-700" />
            <span>Explore Services</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
