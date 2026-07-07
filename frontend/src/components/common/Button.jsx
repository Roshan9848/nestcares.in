import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon = null,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 active:scale-98 select-none outline-none focus:ring-2 focus:ring-teal-500/20';
  
  const variants = {
    primary: 'bg-brand-primary hover:bg-brand-secondary text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0 disabled:hover:shadow-sm',
    secondary: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/60 shadow-sm hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0',
    success: 'bg-brand-accent hover:bg-blue-600 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0',
    glass: 'bg-white/40 hover:bg-white/60 text-slate-800 border border-white/40 backdrop-blur-md shadow-sm hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0',
    link: 'text-teal-800 hover:text-teal-900 hover:underline px-0 py-0 rounded-none bg-transparent active:scale-100 focus:ring-0',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-[10px] gap-1.5',
    md: 'px-5 py-2.5 text-xs gap-2',
    lg: 'px-7 py-3 text-sm gap-2.5',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${size === 'link' ? '' : sizes[size]} 
        ${isDisabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer'} 
        ${className}
      `}
      onClick={onClick}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
      ) : Icon ? (
        <span className="shrink-0">{Icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
