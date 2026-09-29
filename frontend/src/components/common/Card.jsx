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
        glass-card-premium rounded-2xl p-5 md:p-6 text-left transition-all duration-300
        ${hoverable ? 'hover:border-teal-500/40 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(13,148,136,0.12)]' : ''}
        ${isClickable ? 'cursor-pointer active:scale-[0.99] select-none' : ''}
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
