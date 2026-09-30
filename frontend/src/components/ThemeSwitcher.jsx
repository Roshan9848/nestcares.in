import React, { useState, useEffect } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';

export const PALETTES = [
  {
    id: 'snitch-luxury',
    name: 'Snitch Obsidian',
    subtitle: 'Ultra-Modern Minimalist Monochrome',
    primaryColor: '#09090b',
    secondaryColor: '#27272a',
    previewBadge: 'bg-zinc-900 text-white border-zinc-700'
  },
  {
    id: 'medical-teal',
    name: 'Medical Teal',
    subtitle: 'Mayo Clinic / Apollo 24/7 Standard',
    primaryColor: '#0f766e',
    secondaryColor: '#0d9488',
    previewBadge: 'bg-teal-50 text-teal-800 border-teal-200'
  },
  {
    id: 'clinical-sapphire',
    name: 'Clinical Sapphire',
    subtitle: 'Prestige Hospital & Diagnostic',
    primaryColor: '#1d4ed8',
    secondaryColor: '#2563eb',
    previewBadge: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  {
    id: 'nordic-sage',
    name: 'Nordic Sage & Mint',
    subtitle: 'Modern Clean Wellness & Recovery',
    primaryColor: '#047857',
    secondaryColor: '#059669',
    previewBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  {
    id: 'clinical-indigo',
    name: 'Clinical Indigo',
    subtitle: 'One Medical / Stanford Health Care',
    primaryColor: '#4338ca',
    secondaryColor: '#4f46e5',
    previewBadge: 'bg-indigo-50 text-indigo-800 border-indigo-200'
  }
];

const ThemeSwitcher = () => {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('nestcares_theme') || 'medical-teal';
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
    localStorage.setItem('nestcares_theme', activeTheme);
  }, [activeTheme]);

  const selectTheme = (id) => {
    setActiveTheme(id);
    setIsOpen(false);
  };

  const currentObj = PALETTES.find(p => p.id === activeTheme) || PALETTES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 transition-all duration-200 cursor-pointer shadow-sm"
        title="Switch Medical Color Theme"
      >
        <span 
          className="w-3.5 h-3.5 rounded-full shadow-sm"
          style={{ background: `linear-gradient(135deg, ${currentObj.primaryColor}, ${currentObj.secondaryColor})` }}
        />
        <span className="hidden sm:inline text-xs font-semibold">{currentObj.name}</span>
        <Palette className="w-3.5 h-3.5 text-slate-500" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white/95 backdrop-blur-xl p-3 border border-slate-200 shadow-xl z-50 text-left animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-teal-600" />
                Medical Color Palette
              </span>
              <span className="text-[10px] text-slate-400 font-bold">4 Styles</span>
            </div>

            <div className="space-y-1.5">
              {PALETTES.map((p) => {
                const isSelected = p.id === activeTheme;
                return (
                  <button
                    key={p.id}
                    onClick={() => selectTheme(p.id)}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-100 border border-slate-300 text-slate-950 font-bold shadow-xs'
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span 
                        className="w-4 h-4 rounded-full shadow-xs shrink-0"
                        style={{ background: `linear-gradient(135deg, ${p.primaryColor}, ${p.secondaryColor})` }}
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">{p.name}</div>
                        <div className="text-[10px] text-slate-500">{p.subtitle}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-teal-700 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;
