import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  PhoneCall, MessageSquare, Menu, X, ArrowRight, 
  Search, ShieldCheck, HeartPulse, Stethoscope, 
  UserCheck, Sparkles, ChevronRight, Activity, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resolveImageUrl } from '../utils/url';
import ThemeSwitcher from './ThemeSwitcher';

const TICKER_MESSAGES = [
  "⚡ 24/7 CLINICAL EMERGENCY DISPATCH • AVERAGE ARRIVAL: 15 MINS IN NIZAMABAD",
  "🏥 ICU SETUP AT HOME • HOSPITAL-GRADE VENTILATORS & MULTIPARA MONITORS",
  "👨‍⚕️ VERIFIED SPECIALIST DOCTORS & CERTIFIED CRITICAL CARE NURSES",
  "📞 EMERGENCY HELPLINE: +91 92488 49388 • ZERO ADVANCE REQUIRED"
];

const POPULAR_SEARCH_TAGS = [
  "Doctor Visit", "ICU Setup", "Nursing Care", "Injection Service", 
  "Physiotherapy", "ECG at Home", "Wound Dressing", "Oxygen Cylinder"
];

const Navbar = ({ webSettings }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tickerIndex, setTickerIndex] = useState(0);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('preferred_language') || 'english');
  const searchInputRef = useRef(null);

  // Auto-rotate announcement ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_MESSAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

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
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  const isTe = currentLang === 'telugu';

  const baseLinks = isTe ? [
    { name: 'హోమ్', path: '/' },
    { name: 'సేవలు', path: '/services', badge: '14+' },
    { name: 'వైద్యులు', path: '/about' },
    { name: 'మా గురించి', path: '/about-us' },
    { name: 'సంప్రదించండి', path: '/contact' },
  ] : [
    { name: 'HOME', path: '/' },
    { name: 'SERVICES', path: '/services', badge: '14+' },
    { name: 'DOCTORS', path: '/about' },
    { name: 'ABOUT US', path: '/about-us' },
    { name: 'CONTACT', path: '/contact' },
  ];

  const navLinks = user ? [...baseLinks, { name: isTe ? 'అడ్మిన్ CMS' : 'ADMIN CMS', path: '/admin' }] : baseLinks;

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/services?search=${encodeURIComponent(tag)}`);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/[0.08] transition-all duration-200">
        
        {/* Top Ticker / Snitch-Style Announcement Bar - Ultra sleek on mobile */}
        <div className="bg-[#09090b] text-white py-1 sm:py-1.5 px-3 sm:px-8 text-[9px] sm:text-[11px] font-semibold tracking-wider uppercase flex items-center justify-between border-b border-white/10 select-none">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden whitespace-nowrap">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-bold text-slate-200 tracking-wide truncate max-w-[280px] xs:max-w-xs sm:max-w-none">
              {TICKER_MESSAGES[tickerIndex]}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0 text-slate-300 text-[10px]">
            <a 
              href="tel:+919248849388" 
              className="hover:text-white transition-colors flex items-center gap-1 font-bold text-emerald-400"
            >
              <PhoneCall className="w-3 h-3" />
              <span>24/7 HELPLINE: +91 92488 49388</span>
            </a>
            <span className="text-slate-600">|</span>
            <button 
              onClick={toggleLang}
              className="hover:text-white transition-colors font-bold uppercase cursor-pointer"
            >
              🌐 {isTe ? 'TELUGU (తెలుగు)' : 'ENGLISH (EN)'}
            </button>
          </div>
        </div>

        {/* Main Snitch-Style Luxury Navbar - Compact 52px on mobile, 64px on desktop */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-13 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Mobile Menu Trigger + Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 -ml-1 rounded-lg text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </button>

            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-slate-50 p-1 flex items-center justify-center border border-slate-200 group-hover:border-slate-400 transition-all">
                <img
                  src={logoSrc}
                  onError={() => setLogoSrc('/logo.png')}
                  alt={webSettings?.companyName || "Nest Cares"}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm sm:text-base font-black text-slate-950 tracking-tight leading-none uppercase">
                  {webSettings?.companyName || "NEST CARES"}
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">
                  Healthcare • Nizamabad
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links (Snitch Clean Typography) */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={`text-xs font-bold tracking-wider uppercase transition-all relative py-1 ${
                    isActive
                      ? 'text-slate-950 font-black'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="text-[9px] bg-slate-100 text-slate-800 font-extrabold px-1.5 py-0.2 rounded-full border border-slate-200">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-950 rounded-full" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right: Actions, Search, Language, Helpline & Snitch CTA Button */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Instant Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 sm:px-3 sm:py-2 rounded-full hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-transparent hover:border-slate-200"
              title="Search Services, Doctors, ICU"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
              <span className="hidden xl:inline text-slate-500 text-xs">Search services...</span>
            </button>

            {/* Theme Switcher */}
            <div className="hidden sm:block">
              <ThemeSwitcher />
            </div>

            {/* Language Toggle (Desktop) */}
            <button
              onClick={toggleLang}
              className="hidden sm:flex px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-[11px] font-bold uppercase transition-all cursor-pointer"
            >
              {isTe ? 'తెలుగు' : 'EN'}
            </button>

            {/* Emergency Phone Dialer */}
            <a
              href="tel:+919248849388"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 text-xs font-bold transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>92488 49388</span>
            </a>

            {/* Snitch-Style Bold Obsidian CTA Button - Compact on Mobile */}
            <Link
              to="/book"
              className="px-3.5 py-1.5 sm:px-5 sm:py-2 bg-slate-950 hover:bg-neutral-800 active:scale-95 text-white text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-full shadow-xs hover:shadow-md transition-all flex items-center gap-1 shrink-0"
            >
              <span>{isTe ? 'బుకింగ్' : 'BOOK'}</span>
              <ArrowRight className="w-3 h-3 text-slate-300 hidden sm:inline" />
            </Link>

          </div>

        </div>

        {/* Snitch-Style Instant Search Dropdown / Bar */}
        {searchOpen && (
          <div className="border-t border-slate-200/80 bg-white/98 backdrop-blur-2xl shadow-xl px-4 sm:px-8 py-5 animate-in slide-in-from-top-2">
            <div className="max-w-3xl mx-auto space-y-4">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 absolute left-4 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search home care services, ICU setup, injections, nursing, doctors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-24 py-3 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-300 focus:border-slate-900 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 bg-slate-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Search
                </button>
              </form>

              {/* Popular Search Suggestions */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Popular:</span>
                {POPULAR_SEARCH_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-950 hover:text-white text-slate-700 text-xs font-medium transition-all cursor-pointer border border-slate-200/80"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </header>

      {/* Snitch-Style Mobile Slide-Over Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden select-none">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Left slide-over panel */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-slate-50 p-1 flex items-center justify-center border border-slate-200">
                  <img src={logoSrc} alt="Nest Cares" className="h-full w-full object-contain" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-black text-slate-950 uppercase tracking-tight">Nest Cares</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Nizamabad</span>
                </div>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                aria-label="Close Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search In Drawer */}
            <div className="px-5 pt-4">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search services, ICU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </form>
            </div>

            {/* Drawer Menu Links */}
            <div className="p-5 space-y-1 flex-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-3">
                Navigation
              </div>

              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-slate-950 text-white font-extrabold'
                        : 'text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge ? (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'}`}>
                        {link.badge}
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    )}
                  </Link>
                );
              })}

              {/* Quick Highlight Cards inside Mobile Drawer */}
              <div className="pt-4 space-y-2">
                <Link
                  to="/services/icu-at-home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Activity className="w-4 h-4 text-rose-600" />
                    <span>ICU Setup at Home</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Ventilator, monitor & 24/7 critical nurse</p>
                </Link>

                <Link
                  to="/services/nursing-care"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    <span>24/7 Nursing & Injections</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Certified bedside patient attendant</p>
                </Link>
              </div>
            </div>

            {/* Pinned Bottom Drawer Actions */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
              
              {/* Language Switch */}
              <div className="flex items-center justify-between px-1 pb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Language</span>
                <button
                  onClick={toggleLang}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-bold uppercase"
                >
                  🌐 {isTe ? 'తెలుగు (Change)' : 'English (Change)'}
                </button>
              </div>

              {/* Emergency Hotline */}
              <a
                href="tel:+919248849388"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-950 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Call: +91 92488 49388</span>
              </a>

              {/* WhatsApp Support */}
              <a
                href="https://wa.me/919248849388"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Coordinator</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
