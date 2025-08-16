import { useEffect, useState } from 'react';

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

  const toastClass = {
    success: 'text-bg-success',
    error: 'text-bg-danger',
    info: 'text-bg-info',
  }[type] || 'text-bg-info';

  const iconClass = {
    success: 'bi bi-check-circle-fill',
    error: 'bi bi-x-circle-fill',
    info: 'bi bi-info-circle-fill',
  }[type] || 'bi bi-info-circle-fill';

  return (
    <div className="toast-container position-fixed top-0 start-50 translate-middle-x p-3">
      <div className={`toast align-items-center ${toastClass} border-0 ${visible ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex">
          <div className="toast-body d-flex align-items-center">
            <i className={`${iconClass} me-2 fs-5`}></i>
            {displayMessage}
          </div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" onClick={() => setVisible(false)}></button>
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;