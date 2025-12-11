import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { authApi, ApiError } from '../services/api';

/**
 * Custom hook for authentication management
 */
export function useAuth(showToast) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [hasInitAuth, setHasInitAuth] = useState(false);

  const handleLogout = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      try {
        await authApi.logout();
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    Cookies.remove('token');
    localStorage.removeItem('token');
    localStorage.removeItem('sessionId');
    setIsAuthenticated(false);
    setUsername(null);
    setToken(null);
    navigate('/');
  }, [navigate]);

  const handleLogin = useCallback((loggedInUsername, authToken, sessionId) => {
    setIsAuthenticated(true);
    setUsername(loggedInUsername);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
    }
  }, []);

  const handleSessionInvalidated = useCallback(() => {
    showToast?.('Akun Anda telah login di perangkat lain', 'warning');
    handleLogout();
  }, [showToast, handleLogout]);

  useEffect(() => {
    const loadTokenAndAuthenticate = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken) {
        setIsAuthenticated(false);
        if (!hasInitAuth) {
          setIsAuthLoading(false);
          setHasInitAuth(true);
        }
        return;
      }

      setToken(storedToken);
      
      try {
        if (!hasInitAuth) setIsAuthLoading(true);

        const data = await authApi.refreshToken();
        setIsAuthenticated(true);
        setUsername(data.username);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        if (data.sessionId) {
          localStorage.setItem('sessionId', data.sessionId);
        }
      } catch (error) {
        if (error instanceof ApiError && error.sessionInvalidated) {
          handleSessionInvalidated();
        } else {
          console.error('Token refresh error:', error);
          handleLogout();
        }
      } finally {
        if (!hasInitAuth) {
          setIsAuthLoading(false);
          setHasInitAuth(true);
        }
      }
    };

    loadTokenAndAuthenticate();

    // Refresh token every 10 minutes
    const interval = setInterval(() => {
      if (localStorage.getItem('token')) {
        loadTokenAndAuthenticate();
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [handleLogout, handleSessionInvalidated, hasInitAuth]);

  return {
    isAuthenticated,
    username,
    token,
    isAuthLoading,
    handleLogin,
    handleLogout,
    handleSessionInvalidated,
  };
}
