import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Stethoscope, UserCheck, MessageSquare, Calendar, Sparkles } from 'lucide-react';

const MobileBottomNav = ({ contactSettings }) => {
  const location = useLocation();
  const whatsapp = contactSettings?.whatsappNumber || "+91 92488 49388";
  const cleanWhatsapp = whatsapp.replace(/\D/g, '');

  const [currentLang, setCurrentLang] = React.useState(localStorage.getItem('preferred_language') || 'english');

  React.useEffect(() => {
    const syncLang = () => {
      setCurrentLang(localStorage.getItem('preferred_language') || 'english');
    };
    window.addEventListener('languageChanged', syncLang);
    return () => window.removeEventListener('languageChanged', syncLang);
  }, []);

  const isTe = currentLang === 'telugu';

  const navItems = [
    {
      name: isTe ? 'హోమ్' : 'Home',
      path: '/',
      icon: Home
    },
    {
      name: isTe ? 'సేవలు' : 'Services',
      path: '/services',
      icon: Stethoscope
    },
    {
      name: isTe ? 'వైద్యులు' : 'Doctors',
      path: '/about',
      icon: UserCheck
    }
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-50 md:hidden no-print select-none">
      <div className="glass-dock-luxury rounded-3xl p-2 px-3 flex items-center justify-between shadow-2xl border border-slate-200/80">
        
        {/* Navigation Tabs */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-teal-700 font-black scale-105 bg-teal-50 shadow-sm border border-teal-100'
                  : 'text-slate-600 hover:text-slate-900 font-semibold'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600 stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </NavLink>
          );
        })}

        {/* WhatsApp Direct Chat */}
        <a
          href={`https://wa.me/${cleanWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 py-1.5 px-3 text-emerald-600 hover:text-emerald-700 font-bold transition-all hover:bg-emerald-50 rounded-2xl"
          title="WhatsApp Support"
        >
          <MessageSquare className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] tracking-tight">{isTe ? 'వాట్సాప్' : 'WhatsApp'}</span>
        </a>

        {/* Primary Booking Action */}
        <NavLink
          to="/book"
          className={({ isActive }) =>
            `flex items-center gap-1.5 py-2.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md ${
              isActive
                ? 'bg-teal-600 text-white scale-105 shadow-teal-600/30'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
            }`
          }
        >
          <Calendar className="w-4 h-4 text-white" />
          <span>{isTe ? 'బుకింగ్' : 'Book'}</span>
        </NavLink>

      </div>
    </div>
  );
};

export default MobileBottomNav;
