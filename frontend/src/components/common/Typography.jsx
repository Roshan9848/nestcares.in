import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const SectionHeading = ({
  tag,
  title,
  description,
  align = 'center',
  className = '',
  ...props
}) => {
  const alignClasses = align === 'left' ? 'text-left items-start' : 'text-center items-center';
  
  return (
    <div className={`flex flex-col gap-2.5 max-w-3xl ${align === 'center' ? 'mx-auto' : ''} ${alignClasses} ${className}`} {...props}>
      {tag && (
        <span className="text-[10px] font-bold text-teal-800 uppercase tracking-widest block">
          {tag}
        </span>
      )}
      {title && (
        <h2 className="text-xl sm:text-2xl font-serif-editorial font-bold text-slate-900 tracking-tight leading-tight">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-slate-500 text-xs leading-relaxed font-semibold max-w-xl">
          {description}
        </p>
      )}
    </div>
  );
};

export const PageBanner = ({
  title,
  description,
  breadcrumbs = [],
  image = '',
  className = '',
  ...props
}) => {
  return (
    <div className={`bg-gradient-to-r from-teal-900/5 via-teal-850/5 to-slate-900/5 rounded-3xl p-6 sm:p-8 border border-teal-800/10 mb-8 relative overflow-hidden text-left ${className}`} {...props}>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(13,148,136,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(13,148,136,0.015)_1px,_transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full relative z-10">
        <div className={`flex flex-col gap-3 ${image ? 'md:col-span-8' : 'md:col-span-12'}`}>
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={idx}>
                    {crumb.path ? (
                      <Link to={crumb.path} className="hover:text-teal-800 transition-colors">
                        {crumb.name}
                      </Link>
                    ) : (
                      <span className="text-slate-500">{crumb.name}</span>
                    )}
                    {!isLast && <ChevronRight className="w-3.5 h-3.5 text-slate-350" />}
                  </React.Fragment>
                );
              })}
            </nav>
          )}

          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif-editorial font-bold text-slate-900 leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-slate-500 text-xs mt-1.5 leading-relaxed font-semibold max-w-xl">
                {description}
              </p>
            )}
          </div>
        </div>

        {image && (
          <div className="md:col-span-4 hidden md:flex items-center justify-end relative h-[140px]">
            <div className="relative w-80 h-[130px] rounded-2xl overflow-hidden border border-slate-200/50 shadow-sm p-1 bg-white">
              <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover rounded-[12px]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
