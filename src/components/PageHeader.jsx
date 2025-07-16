import React from 'react';

const PageHeader = ({ 
  title, 
  subtitle, 
  icon, 
  actions = null,
  className = ""
}) => {
  return (
    <div className={`page-header text-center mb-4 fade-in ${className}`}>
      {icon && (
        <div className="mb-3">
          <i className={`${icon} display-4 text-primary`}></i>
        </div>
      )}
      <h1 className="h3 fw-bold text-primary mb-2">
        {title}
      </h1>
      {subtitle && (
        <p className="text-muted mb-0">
          {subtitle}
        </p>
      )}
      {actions && (
        <div className="mt-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;