import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ webSettings }) => {
  const { user } = useAuth();
  const location = useLocation();

  const [currentLang, setCurrentLang] = React.useState(localStorage.getItem('preferred_language') || 'english');

  const toggleLang = () => {
    const nextLang = currentLang === 'english' ? 'telugu' : 'english';
    localStorage.setItem('preferred_language', nextLang);
    setCurrentLang(nextLang);
    window.dispatchEvent(new Event('languageChanged'));
  };

  React.useEffect(() => {
    const syncLang = () => {
      setCurrentLang(localStorage.getItem('preferred_language') || 'english');
    };
    window.addEventListener('languageChanged', syncLang);
    return () => window.removeEventListener('languageChanged', syncLang);
  }, []);

  const tagline = currentLang === 'english' 
    ? 'Your Safety is Our Priority 🛡️' 
    : 'మీ రక్షణే మా ప్రథమ ప్రాధాన్యత 🛡️';

  const navLinks = currentLang === 'english' ? [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ] : [
    { name: 'హోమ్', path: '/' },
    { name: 'మా గురించి', path: '/about-us' },
    { name: 'సేవలు', path: '/services' },
    { name: 'సంప్రదించండి', path: '/contact' },
  ];

  const resolveLogoUrl = (logoUrl) => {
    if (!logoUrl) return '';
    if (logoUrl.startsWith('/')) {
      if (logoUrl === '/logo.png') {
        return '/logo.png';
      }
      return `http://localhost:5000${logoUrl}`;
    }
    return logoUrl;
  };

  const [logoSrc, setLogoSrc] = React.useState(resolveLogoUrl(webSettings?.logoUrl));

  React.useEffect(() => {
    if (webSettings?.logoUrl) {
      setLogoSrc(resolveLogoUrl(webSettings.logoUrl));
    }
  }, [webSettings?.logoUrl]);

  return (
    <>
      {/* Top Tagline & Language Selector Utility Bar */}
      <div className="fixed top-0 left-0 right-0 h-8 bg-slate-950 text-slate-350 md:flex hidden items-center justify-between px-6 z-50 no-print border-b border-white/5 text-[9px] font-black uppercase tracking-widest font-sans select-none">
        <span>{tagline}</span>
        
        {/* Language switch button */}
        <button 
          onClick={toggleLang}
          className="flex items-center gap-1 bg-white/5 hover:bg-white/10 hover:text-white text-slate-300 px-2.5 py-1 rounded-md border border-white/10 active:scale-95 transition-all cursor-pointer font-extrabold uppercase text-[8px] tracking-wider"
        >
          <span>🌐</span>
          <span>{currentLang === 'english' ? 'తెలుగు' : 'ENGLISH'}</span>
        </button>
      </div>

      {/* Separate Floating Logo on Top Left */}
      <div className="fixed top-12 left-6 z-50 h-[56px] hidden md:flex items-center no-print">
        <Link to="/" className="transition-transform active:scale-95 block">
          {logoSrc ? (
            <div className="h-[52px] flex items-center justify-start bg-white/90 backdrop-blur-md border border-slate-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-2xl px-3.5 py-1">
              <img
                src={logoSrc}
                onError={() => {
                  if (logoSrc !== '/logo.png') {
                    setLogoSrc('/logo.png');
                  }
                }}
                alt={webSettings?.companyName || "Company Logo"}
                className="h-[40px] w-auto object-contain"
              />
            </div>
          ) : (
            <div className="h-[52px] border border-slate-200/50 rounded-2xl bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-center px-4 gap-2.5">
              <div className="p-1.5 bg-slate-100 rounded-full text-slate-400 shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left leading-none flex flex-col justify-center">
                <span className="text-[9px] font-extrabold text-slate-800 uppercase tracking-widest block">LOGO HERE</span>
                <span className="text-[7px] font-bold text-slate-450 uppercase block mt-0.5 line-clamp-1">{webSettings?.companyName || 'Company Name'}</span>
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-4 z-40 md:hidden no-print shadow-sm">
        <Link to="/" className="h-8 flex items-center">
          {logoSrc ? (
            <img src={logoSrc} alt={webSettings?.companyName || "Logo"} className="h-8 w-auto object-contain" />
          ) : (
            <span className="text-xs font-black tracking-widest text-slate-800">{webSettings?.companyName || 'NEST CARES'}</span>
          )}
        </Link>
        <div className="flex items-center gap-2">
          {/* Language Switch Button */}
          <button 
            onClick={toggleLang}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200/65 active:scale-95 transition-all cursor-pointer font-bold uppercase text-[9px] tracking-wider"
          >
            <span>{currentLang === 'english' ? 'తెలుగు' : 'EN'}</span>
          </button>
          <Link 
            to="/services" 
            className="bg-black hover:bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm transition-all active:scale-95"
          >
            <span>{currentLang === 'english' ? 'Book' : 'బుకింగ్'}</span>
          </Link>
        </div>
      </div>

      {/* Floating Center Capsule Navbar (Desktop Only) */}
      <header className="fixed top-12 left-0 right-0 z-50 md:flex hidden justify-center no-print px-4">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/50 shadow-[0_10px_35px_rgba(0,0,0,0.12)] rounded-full px-5 py-2 flex items-center gap-5 w-fit max-w-full">
          
          {/* Navigation Links - Text-based, active state is a soft pill highlight */}
          <nav className="flex items-center gap-0.5 sm:gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={`text-[9px] sm:text-xs font-bold uppercase tracking-wider px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </NavLink>
              );
            })}

            {/* CMS Admin Link if user is logged in */}
            {user && (
              <Link
                to="/admin"
                className="text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1 transition-all"
              >
                <SettingsIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CMS</span>
              </Link>
            )}
          </nav>

          {/* Vertical Divider */}
          <span className="h-5 w-px bg-slate-200"></span>

          {/* Black Pill Button */}
          <Link
            to="/services"
            className="bg-black hover:bg-slate-900 text-white px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 hover:shadow-lg active:scale-95 text-center whitespace-nowrap"
          >
            <span className="sm:hidden">{currentLang === 'english' ? 'Book Now' : 'బుకింగ్'}</span>
            <span className="hidden sm:inline">{currentLang === 'english' ? 'Book Appointment' : 'సేవను బుక్ చేయండి'}</span>
            <ArrowRight className="w-3 h-3 text-white" />
          </Link>
        </div>
      </header>

      {/* Premium Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200/50 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] py-2 px-4 flex items-center justify-around z-50 md:hidden no-print">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive ? 'text-teal-850 scale-105 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {/* Dynamic SVGs for Mobile Bottom Nav */}
              {link.name === 'Home' || link.name === 'హోమ్' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              ) : link.name === 'About Us' || link.name === 'మా గురించి' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : link.name === 'Services' || link.name === 'సేవలు' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              )}
              <span className="text-[9px] uppercase tracking-wider font-black">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Navbar;
