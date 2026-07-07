import React from 'react';
import { PageBanner } from './Typography';

const PageLayout = ({
  children,
  title = '',
  description = '',
  breadcrumbs = [],
  image = '',
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full min-h-[70vh] flex flex-col justify-start text-left ${className}`} {...props}>
      {title && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 w-full">
          <PageBanner
            title={title}
            description={description}
            breadcrumbs={breadcrumbs}
            image={image}
          />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full flex-1">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
