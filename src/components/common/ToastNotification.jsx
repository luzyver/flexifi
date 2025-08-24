import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

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

  const toastStyles = {
    success: 'bg-success-600 text-white',
    error: 'bg-danger-600 text-white',
    info: 'bg-info-600 text-white',
    warning: 'bg-warning-600 text-white',
  }[type] || 'bg-info-600 text-white';

  const Icon = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: Info,
  }[type] || Info;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4">
      <div className={`flex items-center p-4 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 max-w-md ${toastStyles} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}>
        <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
        <div className="flex-1 text-sm font-medium">
          {displayMessage}
        </div>
        <button
          onClick={() => setVisible(false)}
          className="ml-3 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
