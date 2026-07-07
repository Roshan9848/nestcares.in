import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-premium animate-pulse flex flex-col gap-4">
      <div className="w-full h-48 bg-slate-200 rounded-xl"></div>
      <div className="h-6 bg-slate-200 rounded w-2/3"></div>
      <div className="h-4 bg-slate-200 rounded w-full"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
        <div className="h-10 bg-slate-200 rounded-lg w-1/3"></div>
      </div>
    </div>
  );
};

export const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {[1, 2, 3, 4].map(idx => (
        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-slate-200 rounded w-16"></div>
            <div className="h-8 bg-slate-200 rounded w-12"></div>
          </div>
          <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
        </div>
      ))}
    </div>
  );
};

export const BookingTableSkeleton = () => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden animate-pulse">
      <div className="h-16 bg-slate-50 border-b border-slate-100 flex items-center px-6 justify-between">
        <div className="h-6 bg-slate-200 rounded w-48"></div>
        <div className="h-8 bg-slate-200 rounded w-32"></div>
      </div>
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5].map(idx => (
          <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="h-4 bg-slate-200 rounded w-24"></div>
            <div className="h-4 bg-slate-200 rounded w-32"></div>
            <div className="h-4 bg-slate-200 rounded w-20"></div>
            <div className="h-8 bg-slate-200 rounded-lg w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
