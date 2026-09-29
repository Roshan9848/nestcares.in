import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldAlert, Heart, Sparkles } from 'lucide-react';

const Footer = ({ webSettings, contactSettings }) => {
  const companyName = webSettings?.companyName || 'Nest Cares';
  const footerContent = webSettings?.footerContent || 'Providing hospital-quality medical services at the comfort of your home. Trusted by over 10,000+ families across Nizamabad.';
  const copyright = webSettings?.copyright || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`;

  const phone = contactSettings?.phoneNumbers?.[0] || '+91 92488 49388';
  const email = contactSettings?.emailAddress || 'contact@nestcares.in';
  const address = contactSettings?.officeAddress || 'Chandra Shekar Colony, Nizamabad, Telangana - 503002';
  const emergency = contactSettings?.emergencyContact || '+91 92488 49388';

  return (
    <footer className="bg-slate-50 border-t border-slate-200/80 text-slate-600 pt-20 pb-8 relative z-10 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Emergency Contact Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_10px_30px_rgba(225,29,72,0.2)] border border-rose-500/20 -translate-y-24 mb-[-40px]">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="p-3 bg-white/20 rounded-2xl shrink-0">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">Need Urgent Medical Assistance?</h3>
              <p className="text-rose-100 text-xs sm:text-sm mt-1 font-medium">Our emergency dispatch team is available 24/7 in Nizamabad. Immediate priority response.</p>
            </div>
          </div>
          <a
            href={`tel:${String(emergency || '').replace(/[^+\d]/g, '')}`}
            className="px-8 py-4 bg-white text-rose-600 hover:bg-rose-50 font-black rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-lg text-base shrink-0 hover:scale-102 cursor-pointer"
          >
            <Phone className="w-5 h-5 fill-current animate-bounce" />
            <span>{emergency}</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-12 mb-16">
          {/* Company Brief */}
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
                N
              </div>
              <h4 className="text-lg font-black text-slate-900 tracking-wide">{companyName}</h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">{footerContent}</p>
            <div className="flex items-center gap-2 text-xs text-teal-700 font-bold mt-2 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Certified Nizamabad Healthcare Partner</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h4 className="text-xs font-black text-slate-900 tracking-widest uppercase mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link to="/" className="text-slate-600 hover:text-teal-700 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 hover:text-teal-700 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-600 hover:text-teal-700 transition-colors">Healthcare Services</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 hover:text-teal-700 transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to="/book" className="text-teal-700 font-bold hover:text-teal-800 transition-colors">Book an Appointment</Link>
              </li>
            </ul>
          </div>

          {/* Services list quick navigations */}
          <div className="text-left">
            <h4 className="text-xs font-black text-slate-900 tracking-widest uppercase mb-6">Our Services</h4>
            <ul className="space-y-3 text-sm text-slate-600 font-medium">
              <li className="hover:text-teal-700 transition-colors">Doctor Consultation</li>
              <li className="hover:text-teal-700 transition-colors">Nursing Care at Home</li>
              <li className="hover:text-teal-700 transition-colors">ICU Setup at Home</li>
              <li className="hover:text-teal-700 transition-colors">Laboratory Testing</li>
              <li className="hover:text-teal-700 transition-colors">Physiotherapy</li>
              <li className="hover:text-teal-700 transition-colors">Dietician Advisory</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4 text-sm text-slate-600 text-left">
            <h4 className="text-xs font-black text-slate-900 tracking-widest uppercase mb-2">Get in Touch</h4>
            <div className="flex gap-3">
              <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-1" />
              <span className="text-xs sm:text-sm text-slate-700 leading-snug">{address}</span>
            </div>
            <div className="flex gap-3 items-start">
              <Phone className="w-4 h-4 text-teal-600 shrink-0 mt-1" />
              <div className="flex flex-col gap-1 text-xs sm:text-sm text-slate-700">
                <a href="tel:+919248849388" className="hover:text-teal-700 transition-colors block font-semibold">+91 92488 49388 (Main)</a>
                <a href="tel:+916303591409" className="hover:text-teal-700 transition-colors block font-semibold">+91 63035 91409</a>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Mail className="w-4 h-4 text-teal-600 shrink-0" />
              <a href={`mailto:${email}`} className="text-xs sm:text-sm text-slate-700 hover:text-teal-700 transition-colors font-medium">{email}</a>
            </div>
          </div>
        </div>

        {/* Footer Sub-row */}
        <div className="border-t border-slate-200/80 pt-8 pb-24 md:pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div>{copyright}</div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <Link to="/login" className="hover:text-teal-700 transition-colors flex items-center gap-1 font-semibold text-slate-600">
              Admin Portal
            </Link>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            Hospital-grade home clinical excellence
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
