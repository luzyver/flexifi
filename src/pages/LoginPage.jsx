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
    <div className="auth-container">
      {/* Background */}
      <div className="auth-background">
        <div className="auth-bg-shape auth-bg-shape-1"></div>
        <div className="auth-bg-shape auth-bg-shape-2"></div>
        <div className="auth-bg-shape auth-bg-shape-3"></div>
      </div>

      {/* Theme Toggle */}
      <button
        className="auth-theme-toggle"
        onClick={toggleDarkMode}
        aria-label="Toggle theme"
      >
        <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
      </button>

      {/* Main Content */}
      <div className="auth-content">
        <div className="auth-left">
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <i className="bi bi-wallet2"></i>
            </div>
            <h1 className="auth-brand-title">FlexiFi</h1>
            <p className="auth-brand-subtitle">Smart Financial Management</p>
          </div>
          
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
              <div>
                <h3>Track Expenses</h3>
                <p>Monitor your spending patterns and financial habits</p>
              </div>
            </div>
            
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <i className="bi bi-pie-chart"></i>
              </div>
              <div>
                <h3>Budget Planning</h3>
                <p>Create and manage budgets for better financial control</p>
              </div>
            </div>
            
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <i className="bi bi-shield-check"></i>
              </div>
              <div>
                <h3>Secure & Private</h3>
                <p>Your financial data is encrypted and protected</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className={`auth-form-container ${animateForm ? 'animate-in' : ''}`}>
            <div className="auth-form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your FlexiFi account</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-input-group">
                <label htmlFor="username">Username</label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-person"></i>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    disabled={isSubmitting}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="password">Password</label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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

              <button 
                type="submit" 
                className="auth-submit-btn" 
                disabled={isSubmitting || !username || !password}
              >
                {isSubmitting ? (
                  <>
                    <div className="auth-spinner"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>Don't have an account?</span>
            </div>

            <Link to="/register" className="auth-secondary-btn">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;