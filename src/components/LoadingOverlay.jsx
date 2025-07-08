import React from 'react';

const LoadingOverlay = ({ isLoading }) => {
  return (
    <div className={`loading-overlay ${isLoading ? 'show' : ''}`}>
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingOverlay;
