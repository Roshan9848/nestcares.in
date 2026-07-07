import React from 'react';

const Input = React.forwardRef(({
  label,
  error,
  icon: Icon = null,
  type = 'text',
  className = '',
  id,
  required = false,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full text-left font-sans">
      {label && (
        <label htmlFor={id} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      
      <div className="relative w-full">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 shrink-0 pointer-events-none">
            {Icon}
          </div>
        )}
        
        <input
          ref={ref}
          id={id}
          type={type}
          className={`
            w-full bg-white text-slate-800 text-xs border rounded-xl placeholder-slate-400 outline-none transition-all duration-300 font-semibold
            ${Icon ? 'pl-10' : 'px-4'} 
            py-2.5
            ${error 
              ? 'border-rose-350 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10' 
              : 'border-slate-200 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10'
            }
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1 animate-fade-in">
          <span>{error}</span>
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
