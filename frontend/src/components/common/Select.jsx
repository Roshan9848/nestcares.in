import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select an option',
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
        <select
          ref={ref}
          id={id}
          className={`
            w-full bg-white text-slate-800 text-xs border rounded-xl outline-none transition-all duration-300 font-semibold appearance-none pr-10 pl-4 py-2.5 cursor-pointer
            ${error 
              ? 'border-rose-350 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10' 
              : 'border-slate-200 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10'
            }
            ${className}
          `}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt, idx) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={idx} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <ChevronDown className="w-4 h-4 shrink-0" />
        </div>
      </div>

      {error && (
        <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1 animate-fade-in">
          <span>{error}</span>
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
