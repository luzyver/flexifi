import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const LoginPage = ({ onLogin, showToast }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateForm(true), 100);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Login successful!', 'success');
        onLogin(data.username, data.token, data.sessionId);
      } else {
        showToast(data.error || 'Invalid username or password', 'error');
      }
    } catch (err) {
      showToast('Server error. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container min-vh-100">
      {/* Background Pattern */}
      <div className="auth-background"></div>
      
      <div className="container py-4">
        {/* Theme Toggle */}
        <div className="position-fixed top-0 end-0 m-3" style={{ zIndex: 1050 }}>
          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
          </button>
        </div>
        
        <div className="row justify-content-center">
          <div className="col-11 col-sm-9 col-md-7 col-lg-5 col-xl-4 col-xxl-3">
            <div className={`auth-card ${animateForm ? 'animate__animated animate__fadeIn' : 'opacity-0'}`}>
              
              {/* Header */}
              <div className="auth-card-body">
                <div className="auth-header">
                  <div className="auth-logo">
                    <div className="auth-logo-icon">
                      <i className="bi bi-wallet2"></i>
                    </div>
                    <h1 className="auth-logo-text">FlexiFi</h1>
                  </div>
                  <h2 className="auth-title">Welcome Back</h2>
                  <p className="auth-subtitle">Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="auth-form-group">
                    <label htmlFor="username" className="auth-form-label">Username</label>
                    <input
                      type="text"
                      id="username"
                      className="auth-form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      required
                      disabled={isSubmitting}
                      autoComplete="username"
                    />
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="password" className="auth-form-label">Password</label>
                    <div className="auth-password-input">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="auth-form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      disabled={isSubmitting}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                    </div>
                  </div>

                  <div className="auth-form-group">
                    <button 
                      type="submit" 
                      className="auth-btn auth-btn-primary" 
                      disabled={isSubmitting || !username || !password}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="auth-spinner"></span>
                          Signing in...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-arrow-right me-2"></i>
                          Sign In
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Footer */}
                <div className="auth-footer">
                  <p className="auth-footer-text">Don't have an account?</p>
                  <Link to="/register" className="auth-btn auth-btn-outline">
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;