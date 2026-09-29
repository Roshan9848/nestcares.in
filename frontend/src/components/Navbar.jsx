import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  PhoneCall, MessageSquare, Menu, X, ArrowRight, 
  Sparkles, Stethoscope, UserCheck, ShieldCheck, HeartPulse
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resolveImageUrl } from '../utils/url';
import ThemeSwitcher from './ThemeSwitcher';

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
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 transition-all">
      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_10px_35px_rgba(15,23,42,0.06)] rounded-3xl sm:rounded-full px-4 sm:px-6 h-16 sm:h-[68px] flex items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-teal-50 p-1.5 flex items-center justify-center border border-teal-100 group-hover:scale-105 transition-transform">
            <img
              src={logoSrc}
              onError={() => setLogoSrc('/logo.png')}
              alt={webSettings?.companyName || "Nest Cares"}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight flex items-center gap-1.5">
              <span>Nest Cares</span>
              <span className="text-[10px] bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded-full border border-teal-200">
                Nizamabad
              </span>
            </span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">
              Home Healthcare
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-teal-800 text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Action Elements */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          
          {/* Theme Palette Switcher */}
          <ThemeSwitcher />

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[11px] font-bold uppercase transition-all cursor-pointer"
          >
            🌐 {currentLang === 'english' ? 'తెలుగు' : 'English'}
          </button>

          {/* Standby Helpline Dial */}
          <a
            href="tel:+919248849388"
            className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-2 transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5 text-teal-700" />
            <span>+91 92488 49388</span>
          </a>

          {/* Primary Glow CTA Button */}
          <Link
            to="/book"
            className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <span>{currentLang === 'english' ? 'Book Care' : 'బుకింగ్'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-200" />
          </Link>
        </div>

        {/* Mobile Header Controls */}
        <div className="flex sm:hidden items-center gap-1.5">
          <ThemeSwitcher />

          <a
            href="tel:+919248849388"
            className="p-2 rounded-2xl bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center"
            title="Call Helpline"
          >
            <PhoneCall className="w-4 h-4" />
          </a>

          <button 
            onClick={toggleLang}
            className="px-2.5 py-1.5 rounded-2xl bg-slate-100 text-slate-800 text-[11px] font-bold uppercase border border-slate-200"
          >
            {currentLang === 'english' ? 'తె' : 'EN'}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-2xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors border border-slate-200"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-down Glass Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 max-w-7xl mx-auto bg-white/95 backdrop-blur-2xl rounded-3xl p-5 space-y-4 shadow-xl border border-slate-200 text-left animate-in slide-in-from-top-4">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
                    isActive ? 'bg-teal-800 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <a
              href="tel:+919248849388"
              className="w-full py-3 px-4 rounded-2xl bg-teal-800 text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Helpline: +91 92488 49388</span>
            </a>

            <a
              href="https://wa.me/919248849388"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Coordinator</span>
            </a>
          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;
