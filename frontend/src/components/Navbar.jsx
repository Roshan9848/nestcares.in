import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  PhoneCall, MessageSquare, Menu, X, ArrowRight, 
  Sparkles, Stethoscope, UserCheck, ShieldCheck, HeartPulse
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resolveImageUrl } from '../utils/url';

const Navbar = ({ webSettings }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('preferred_language') || 'english');

  const toggleLang = () => {
    const nextLang = currentLang === 'english' ? 'telugu' : 'english';
    localStorage.setItem('preferred_language', nextLang);
    setCurrentLang(nextLang);
    window.dispatchEvent(new Event('languageChanged'));
  };

  useEffect(() => {
    const syncLang = () => {
      setCurrentLang(localStorage.getItem('preferred_language') || 'english');
    };
    window.addEventListener('languageChanged', syncLang);
    return () => window.removeEventListener('languageChanged', syncLang);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const baseLinks = currentLang === 'english' ? [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Doctors', path: '/about' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact', path: '/contact' },
  ] : [
    { name: 'హోమ్', path: '/' },
    { name: 'సేవలు', path: '/services' },
    { name: 'వైద్యులు', path: '/about' },
    { name: 'మా గురించి', path: '/about-us' },
    { name: 'సంప్రదించండి', path: '/contact' },
  ];

  const navLinks = user ? [...baseLinks, { name: 'Admin CMS', path: '/admin' }] : baseLinks;

  const resolveLogoUrl = (logoUrl) => {
    if (!logoUrl) return '/logo.png';
    if (logoUrl.startsWith('/')) {
      if (logoUrl === '/logo.png') return '/logo.png';
      return resolveImageUrl(logoUrl);
    }
    return logoUrl;
  };

  const [logoSrc, setLogoSrc] = useState(resolveLogoUrl(webSettings?.logoUrl));

  useEffect(() => {
    if (webSettings?.logoUrl) {
      setLogoSrc(resolveLogoUrl(webSettings.logoUrl));
    }
  }, [webSettings?.logoUrl]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs font-sans transition-all">
      
      {/* Top Standby Announcement Bar */}
      <div className="bg-slate-950 text-white text-[10px] font-mono py-1.5 px-4 hidden sm:flex items-center justify-between border-b border-slate-800">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-teal-300 font-bold uppercase tracking-widest text-[9px]">
              24/7 Nizamabad Home Healthcare
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 text-[10px]">
              {currentLang === 'english' ? 'Hospital-Grade Care at Your Bedside' : 'మీ ఇంటి వద్దే ఇంటెన్సివ్ కేర్ & హాస్పిటల్ సేవలు'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px]">
            <a href="tel:+919248849388" className="text-slate-300 hover:text-teal-300 font-bold flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-teal-400" />
              <span>Helpline: +91 92488 49388</span>
            </a>
            <button
              onClick={toggleLang}
              className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-teal-200 transition-colors cursor-pointer"
            >
              🌐 {currentLang === 'english' ? 'తెలుగు' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Unified Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[70px] flex items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src={logoSrc}
            onError={() => setLogoSrc('/logo.png')}
            alt={webSettings?.companyName || "Nest Cares"}
            className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col text-left">
            <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight">
              Nest Cares<span className="text-teal-700">.in</span>
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
              Home Healthcare
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-50/80 p-1 rounded-2xl border border-slate-200/70">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-teal-900 shadow-xs border border-slate-200/80 font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Actions Desktop */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          
          {/* WhatsApp Direct Chat */}
          <a
            href="https://wa.me/919248849388"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/70 transition-colors hidden md:flex items-center justify-center"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </a>

          {/* Standby Phone Hotline Pill */}
          <a
            href="tel:+919248849388"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold flex items-center gap-1.5 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-teal-700" />
            <span>92488 49388</span>
          </a>

          {/* Primary Book Care CTA Button */}
          <Link
            to="/book"
            className="px-5 py-2.5 bg-teal-900 hover:bg-teal-950 active:scale-95 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-teal-950/15 flex items-center gap-2 cursor-pointer"
          >
            <span>{currentLang === 'english' ? 'Book Care' : 'బుకింగ్ చేయండి'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-300" />
          </Link>
        </div>

        {/* Mobile Hamburger & Quick Book */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            to="/book"
            className="px-3 py-1.5 bg-teal-900 text-white text-[11px] font-bold uppercase rounded-lg shadow-sm"
          >
            {currentLang === 'english' ? 'Book' : 'బుకింగ్'}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-4">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between ${
                    isActive ? 'bg-teal-50 text-teal-900 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              onClick={toggleLang}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-2"
            >
              <span>🌐 Language: {currentLang === 'english' ? 'తెలుగుకు మార్చండి' : 'Switch to English'}</span>
            </button>

            <a
              href="tel:+919248849388"
              className="w-full py-3 px-4 rounded-xl bg-teal-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <PhoneCall className="w-4 h-4 text-teal-300" />
              <span>Call 24/7 Helpline: +91 92488 49388</span>
            </a>

            <a
              href="https://wa.me/919248849388"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-emerald-100" />
              <span>WhatsApp Coordination Desk</span>
            </a>
          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;
