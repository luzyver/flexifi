import React, { useEffect, useState } from 'react';
import './ToastNotification.css';

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

  return (
    <div className={`toast-notification toast-${type} ${visible ? 'show' : 'hide'}`}>
      {displayMessage}
    </div>
  );
};

export default ToastNotification;
