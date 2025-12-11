import { useState, useCallback } from 'react';

/**
 * Custom hook for toast notifications
 */
export function useToast(duration = 3000) {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState('info');

  const showToast = useCallback((msg, toastType = 'info') => {
    setMessage(msg);
    setType(toastType);
    setTimeout(() => setMessage(null), duration);
  }, [duration]);

  const hideToast = useCallback(() => {
    setMessage(null);
  }, []);

  return { message, type, showToast, hideToast };
}
