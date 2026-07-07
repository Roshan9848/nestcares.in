import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldAlert, Heart } from 'lucide-react';

const Footer = ({ webSettings, contactSettings }) => {
  const companyName = webSettings?.companyName || 'Company Name';
  const footerContent = webSettings?.footerContent || 'Providing hospital-quality medical services at the comfort of your home. Trusted by over 10,000+ families.';
  const copyright = webSettings?.copyright || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`;

  const phone = contactSettings?.phoneNumbers?.[0] || '+91 92488 49388';
  const email = contactSettings?.emailAddress || 'contact@carehome.com';
  const address = contactSettings?.officeAddress || 'Chandra Shekar Colony, Nizamabad, Telangana - 503002';
  const emergency = contactSettings?.emergencyContact || '+91 92488 49388';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 relative z-10 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Emergency Contact Banner */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl -translate-y-24 mb-[-40px]">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="p-3 bg-white/10 rounded-full animate-pulse">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Need Urgent Medical Assistance?</h3>
              <p className="text-red-100 text-sm mt-1">Our emergency dispatch team is available 24/7. Call our priority response line.</p>
            </div>
          </div>
          <a
            href={`tel:${String(emergency || '').replace(/[^+\d]/g, '')}`}
            className="px-8 py-4 bg-white text-red-600 hover:bg-slate-100 font-bold rounded-xl flex items-center gap-3 transition-all active:scale-95 shadow-md shadow-black/10 text-lg hover:shadow-lg"
          >
            <Phone className="w-5 h-5 fill-current" />
            <span>{emergency}</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-12 mb-16">
          {/* Company Brief */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-bold text-white tracking-wide">{companyName}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{footerContent}</p>
            <div className="flex items-center gap-1.5 text-xs text-brand-primary mt-2">
              <Heart className="w-3.5 h-3.5 fill-current animate-pulse text-brand-primary" />
              <span>Certified Diagnostics Partner</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold text-white tracking-wider uppercase mb-6">Quick Links</h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-blue hover:underline transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:text-brand-blue hover:underline transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-blue hover:underline transition-colors">Healthcare Services</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-blue hover:underline transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to="/book" className="text-brand-blue font-semibold hover:underline transition-colors">Book an Appointment</Link>
              </li>
            </ul>
          </div>

          {/* Services list quick navigations */}
          <div>
            <h4 className="text-base font-bold text-white tracking-wider uppercase mb-6">Our Services</h4>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li>Doctor Consultation</li>
              <li>Nursing Care at Home</li>
              <li>ICU Setup at Home</li>
              <li>Laboratory Testing</li>
              <li>Physiotherapy</li>
              <li>Dietician Advisory</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4 text-sm text-slate-400">
            <h4 className="text-base font-bold text-white tracking-wider uppercase mb-2">Get in Touch</h4>
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
            <div className="flex gap-3 items-start">
              <Phone className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1.5 text-xs">
                <a href="tel:+919248849388" className="hover:text-white transition-colors block">+91 92488 49388 (Main)</a>
                <a href="tel:+916303591409" className="hover:text-white transition-colors block">+91 63035 91409</a>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Mail className="w-4 h-4 text-brand-blue shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
            </div>
          </div>
        </div>

        {/* Footer Sub-row */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>{copyright}</div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-slate-300 transition-colors flex items-center gap-1">
              <span>Admin Portal</span>
            </Link>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1">
              Developed with medical trust
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
