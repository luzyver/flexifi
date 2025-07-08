import { useState, useCallback } from 'react';

/**
 * Custom hook untuk mengelola toast notifications
 * 
 * @param {number} duration - Durasi tampilan toast dalam milidetik
 * @returns {Object} - Object berisi state dan fungsi untuk toast
 */
const useToast = (duration = 3000) => {
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('info');

  /**
   * Menampilkan toast notification
   * 
   * @param {string} message - Pesan yang akan ditampilkan
   * @param {string} type - Tipe toast (success, error, info, warning)
   */
  const showToast = useCallback((message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    
    // Otomatis menghilangkan toast setelah durasi tertentu
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  }, [duration]);

  /**
   * Menghilangkan toast notification
   */
  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  return {
    toastMessage,
    toastType,
    showToast,
    hideToast
  };
};

export default useToast;