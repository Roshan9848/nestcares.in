import React from 'react';

const Card = ({
  children,
  className = '',
  hoverable = true,
  onClick = null,
  ...props
}) => {
  const isClickable = typeof onClick === 'function';
  
  return (
    <div
      className={`
        bg-white border border-slate-200/50 rounded-2xl p-5 md:p-6 shadow-sm text-left transition-all duration-300
        ${hoverable ? 'hover:shadow-md hover:border-slate-300/40 hover:-translate-y-0.5' : ''}
        ${isClickable ? 'cursor-pointer active:scale-99 select-none' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
