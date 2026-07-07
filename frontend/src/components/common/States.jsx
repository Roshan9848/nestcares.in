import React from 'react';
import { Inbox } from 'lucide-react';

export const SkeletonLoader = ({
  variant = 'card',
  count = 1,
  className = '',
  ...props
}) => {
  const items = Array.from({ length: count });

  const renderSkeletonItem = (idx) => {
    if (variant === 'text') {
      return (
        <div key={idx} className={`space-y-2 animate-pulse ${className}`} {...props}>
          <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
          <div className="h-3 bg-slate-50 rounded-md w-full"></div>
          <div className="h-3 bg-slate-50 rounded-md w-5/6"></div>
        </div>
      );
    }
    
    if (variant === 'list') {
      return (
        <div key={idx} className={`flex items-center gap-4 py-3 animate-pulse border-b border-slate-50 last:border-0 ${className}`} {...props}>
          <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-slate-100 rounded-md w-1/3"></div>
            <div className="h-2.5 bg-slate-50 rounded-md w-1/2"></div>
          </div>
        </div>
      );
    }

    if (variant === 'image') {
      return (
        <div key={idx} className={`w-full h-48 bg-slate-100 rounded-2xl animate-pulse ${className}`} {...props} />
      );
    }

    // Default 'card' skeleton
    return (
      <div key={idx} className={`border border-slate-100 rounded-2xl p-5 space-y-4 animate-pulse bg-white ${className}`} {...props}>
        <div className="w-full h-40 bg-slate-100 rounded-xl"></div>
        <div className="space-y-2.5">
          <div className="h-3 bg-slate-100 rounded-md w-1/4"></div>
          <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
          <div className="h-3 bg-slate-50 rounded-md w-5/6"></div>
        </div>
        <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
          <div className="h-3 bg-slate-105 rounded-md w-1/3"></div>
          <div className="h-7 bg-slate-100 rounded-xl w-20"></div>
        </div>
      </div>
    );
  };

  return (
    <>
      {items.map((_, idx) => renderSkeletonItem(idx))}
    </>
  );
};

export const EmptyState = ({
  title = 'No records found',
  description = 'There are no active records in this view right now.',
  action = null,
  icon: Icon = <Inbox className="w-10 h-10" />,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 rounded-3xl bg-slate-50/30 max-w-md mx-auto my-6 ${className}`} {...props}>
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 shrink-0 mb-4 shadow-inner flex items-center justify-center">
        {Icon}
      </div>
      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">
        {title}
      </h4>
      <p className="text-xs text-slate-400 leading-relaxed font-semibold mb-6 px-4">
        {description}
      </p>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
