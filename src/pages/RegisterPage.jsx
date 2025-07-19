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
                      <i className="bi bi-person-plus"></i>
                    </div>
                    <h1 className="auth-logo-text">FlexiFi</h1>
                  </div>
                  <h2 className="auth-title">Create Account</h2>
                  <p className="auth-subtitle">Join FlexiFi and start managing your finances</p>
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
                    <div className="auth-form-help">
                      Minimum 6 characters required
                    </div>
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="confirmPassword" className="auth-form-label">Confirm Password</label>
                    <div className="auth-password-input">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className={`auth-form-control ${confirmPassword && password !== confirmPassword ? 'error' : ''}`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
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
                      <div className="auth-form-error">
                        Passwords do not match
                      </div>
                    )}
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="activationCode" className="auth-form-label">Activation Code</label>
                    <input
                      type="text"
                      id="activationCode"
                      className="auth-form-control"
                      value={activationCode}
                      onChange={(e) => setActivationCode(e.target.value)}
                      placeholder="Activation Code"
                      required
                      disabled={isSubmitting}
                    />
                    <div className="auth-form-help">
                      Contact <a href="https://t.me/rzvabelioprtma" className="auth-link">administrator</a> for activation code
                    </div>
                  </div>

                  <div className="auth-form-group">
                    <button 
                      type="submit" 
                      className="auth-btn auth-btn-primary" 
                      disabled={isSubmitting || !isFormValid}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="auth-spinner"></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-arrow-right me-2"></i>
                          Create Account
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Security Notice */}
                <div className="auth-security-notice">
                  <div className="auth-security-header">
                    <i className="bi bi-shield-check"></i>
                    <span>Security Information</span>
                  </div>
                  <div className="auth-security-list">
                    <div className="auth-security-item">
                      <i className="bi bi-check-circle"></i>
                      <span>All passwords are encrypted and secure</span>
                    </div>
                    <div className="auth-security-item">
                      <i className="bi bi-check-circle"></i>
                      <span>Registration requires valid activation code</span>
                    </div>
                    <div className="auth-security-item">
                      <i className="bi bi-check-circle"></i>
                      <span>Your account data is protected and private</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="auth-footer">
                  <p className="auth-footer-text">Already have an account?</p>
                  <Link to="/" className="auth-btn auth-btn-outline">
                    Sign In
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

export default RegisterPage;