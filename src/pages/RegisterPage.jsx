import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const RegisterPage = ({ showToast }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateForm(true), 100);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, activationCode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Registration successful! Redirecting...', 'success');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setActivationCode('');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        showToast(data.error || 'Registration failed. Please try again.', 'error');
      }
    } catch (err) {
      showToast('Server error. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = username && password && confirmPassword && activationCode && password === confirmPassword;

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
              <i className="bi bi-person-plus"></i>
            </div>
            <h1 className="auth-brand-title">Join FlexiFi</h1>
            <p className="auth-brand-subtitle">Start your financial journey today</p>
          </div>
          
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <i className="bi bi-speedometer2"></i>
              </div>
              <div>
                <h3>Quick Setup</h3>
                <p>Get started in minutes with our simple onboarding</p>
              </div>
            </div>
            
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <i className="bi bi-graph-up"></i>
              </div>
              <div>
                <h3>Smart Analytics</h3>
                <p>Get insights into your spending and saving patterns</p>
              </div>
            </div>
            
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <i className="bi bi-people"></i>
              </div>
              <div>
                <h3>Trusted by Users</h3>
                <p>Join thousands of users managing their finances</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className={`auth-form-container ${animateForm ? 'animate-in' : ''}`}>
            <div className="auth-form-header">
              <h2>Create Account</h2>
              <p>Join FlexiFi and take control of your finances</p>
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
                    placeholder="Choose a username"
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
                    placeholder="Create a password"
                    required
                    disabled={isSubmitting}
                    autoComplete="new-password"
                    minLength="6"
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
                <div className="auth-input-help">
                  Minimum 6 characters required
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-shield-check"></i>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    className={confirmPassword && password !== confirmPassword ? 'error' : ''}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting}
                  >
                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <div className="auth-input-error">
                    Passwords do not match
                  </div>
                )}
              </div>

              <div className="auth-input-group">
                <label htmlFor="activationCode">Activation Code</label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-key"></i>
                  <input
                    type="text"
                    id="activationCode"
                    value={activationCode}
                    onChange={(e) => setActivationCode(e.target.value)}
                    placeholder="Enter activation code"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="auth-input-help">
                  Contact <a href="https://t.me/rzvabelioprtma" target="_blank" rel="noopener noreferrer">administrator</a> for activation code
                </div>
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn" 
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? (
                  <>
                    <div className="auth-spinner"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            <div className="auth-security-info">
              <div className="auth-security-header">
                <i className="bi bi-shield-check"></i>
                <span>Your data is secure</span>
              </div>
              <div className="auth-security-items">
                <div className="auth-security-item">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>End-to-end encryption</span>
                </div>
                <div className="auth-security-item">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Privacy protected</span>
                </div>
                <div className="auth-security-item">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Secure authentication</span>
                </div>
              </div>
            </div>

            <div className="auth-divider">
              <span>Already have an account?</span>
            </div>

            <Link to="/" className="auth-secondary-btn">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;