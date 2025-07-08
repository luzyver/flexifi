import React, { useEffect, useState } from 'react';
import { Badge, IconButton } from './auth';

const ToastNotification = ({ message, type, duration = 3000 }) => {
  const [visible, setVisible] = useState(false);
  const [displayMessage, setDisplayMessage] = useState('');

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message, duration]);

  useEffect(() => {
    let unmountTimer;
    if (!visible && displayMessage) {
      unmountTimer = setTimeout(() => {
        setDisplayMessage('');
      }, 500);
    }
    return () => clearTimeout(unmountTimer);
  }, [visible, displayMessage]);

  if (!displayMessage && !visible) {
    return null;
  }

  const toastVariant = {
    success: 'success',
    error: 'danger',
    info: 'info',
    warning: 'warning'
  }[type] || 'info';

  const iconClass = {
    success: 'bi bi-check-circle-fill',
    error: 'bi bi-x-circle-fill',
    info: 'bi bi-info-circle-fill',
    warning: 'bi bi-exclamation-triangle-fill'
  }[type] || 'bi bi-info-circle-fill';

  return (
    <div className="toast-container">
      <div 
        className={`toast ${toastVariant} ${visible ? 'show' : ''}`} 
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'all 0.3s ease-in-out',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <i className={`${iconClass} toast-icon`}></i>
        <div className="toast-content">
          {displayMessage}
        </div>
        <button 
          className="toast-close" 
          onClick={() => setVisible(false)}
          aria-label="Close"
        >
          <i className="bi bi-x"></i>
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
