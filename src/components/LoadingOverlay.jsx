import React from 'react';
import { LoadingSpinner } from './auth';

const LoadingOverlay = ({ isLoading }) => {
  return (
    <div className={`loading-overlay ${isLoading ? 'show' : ''}`}>
      <LoadingSpinner 
        size="md" 
        variant="primary" 
        text="Memuat..." 
        fullPage 
      />
    </div>
  );
};

export default LoadingOverlay;
