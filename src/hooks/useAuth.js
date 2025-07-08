import { useState, useCallback } from 'react';
import { fetchAPI } from '../App';

/**
 * Custom hook untuk mengelola state dan logika autentikasi
 * 
 * @param {Function} showToast - Fungsi untuk menampilkan toast notification
 * @param {Function} onLoginSuccess - Callback yang dipanggil ketika login berhasil
 * @returns {Object} - Object berisi state dan fungsi untuk autentikasi
 */
const useAuth = (showToast, onLoginSuccess) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fungsi untuk menangani login
  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { response, data } = await fetchAPI(
        `${API_BASE_URL}/auth/login`,
        {
          method: 'POST',
          body: JSON.stringify({ username, password }),
        }
      );

      if (response.ok && data.success) {
        // Verifikasi token dan sessionId ada dalam respons
        if (!data.token) {
          showToast('Authentication error: No token received', 'error');
          return;
        }
        
        if (!data.sessionId) {
          showToast('Authentication error: No session ID received', 'error');
          return;
        }
        
        showToast('Login successful!', 'success');
        
        // Pastikan token dan sessionId diteruskan dengan benar
        if (onLoginSuccess) {
          // Pass the token and sessionId to App.jsx's handleLogin function
          const loginSuccess = await onLoginSuccess(data.username, data.token, data.sessionId);
          if (!loginSuccess) {
            showToast('Error completing login process', 'error');
          }
        } else {
          showToast('Authentication error: Cannot complete login process', 'error');
        }
      } else {
        showToast(data.error || 'Invalid username or password', 'error');
      }
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        showToast('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', 'error');
      } else {
        showToast('Server error. Please try again later.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [username, password, showToast, onLoginSuccess, API_BASE_URL]);

  // Fungsi untuk menangani register
  const handleRegister = useCallback(async (e, formData) => {
    e.preventDefault();
    
    // Validasi
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const { response, data } = await fetchAPI(
        `${API_BASE_URL}/auth/register`,
        {
          method: 'POST',
          body: JSON.stringify(formData),
        }
      );

      if (response.ok && data.success) {
        showToast('Registration successful! Redirecting to dashboard...', 'success');
        setTimeout(() => {
          onLoginSuccess(data.username, data.token, data.sessionId);
        }, 2000);
      } else {
        showToast(data.error || 'Registration failed. Please try again.', 'error');
      }
    } catch (err) {
      showToast('Server error. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [showToast, onLoginSuccess, API_BASE_URL]);

  // Fungsi untuk toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Fungsi untuk mengaktifkan animasi form
  const enableFormAnimation = useCallback(() => {
    setTimeout(() => setAnimateForm(true), 100);
  }, []);

  return {
    username,
    setUsername,
    password,
    setPassword,
    isSubmitting,
    showPassword,
    animateForm,
    handleLogin,
    handleRegister,
    togglePasswordVisibility,
    enableFormAnimation
  };
};

export default useAuth;