import { memo, useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const STYLES = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-rose-500 text-white',
  warning: 'bg-amber-500 text-white',
  info: 'bg-indigo-500 text-white',
};

const ToastNotification = memo(function ToastNotification({ message, type = 'info', duration = 3000 }) {
  const [visible, setVisible] = useState(false);
  const [displayMessage, setDisplayMessage] = useState('');

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message, duration]);

  useEffect(() => {
    if (!visible && displayMessage) {
      const timer = setTimeout(() => setDisplayMessage(''), 300);
      return () => clearTimeout(timer);
    }
  }, [visible, displayMessage]);

  if (!displayMessage) return null;

  const Icon = ICONS[type] || Info;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 w-full max-w-md">
      <div
        className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-sm transition-all duration-300 ${STYLES[type]} ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="flex-1 font-medium text-sm">{displayMessage}</p>
        <button
          onClick={() => setVisible(false)}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

export default ToastNotification;
