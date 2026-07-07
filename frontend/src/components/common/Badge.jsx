import React from 'react';

const Badge = ({
  children,
  variant = 'teal',
  pulse = false,
  className = '',
  ...props
}) => {
  const variants = {
    teal: 'bg-teal-50 border-teal-200/50 text-teal-900',
    emerald: 'bg-emerald-50 border-emerald-250/50 text-emerald-900',
    blue: 'bg-blue-50 border-blue-200/50 text-blue-900',
    gray: 'bg-slate-50 border-slate-200/50 text-slate-650',
    rose: 'bg-rose-50 border-rose-200/50 text-rose-900',
  };

  const pulses = {
    teal: 'bg-teal-600',
    emerald: 'bg-emerald-600',
    blue: 'bg-blue-600',
    gray: 'bg-slate-400',
    rose: 'bg-rose-600',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 border px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm w-fit
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulses[variant]}`}></span>
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${pulses[variant]}`}></span>
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
