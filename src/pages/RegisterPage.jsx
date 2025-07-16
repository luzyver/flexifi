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
    <div className="register-page-container min-vh-100 d-flex align-items-center">
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
          <div className="col-11 col-sm-9 col-md-7 col-lg-5 col-xl-4">
            <div className={`card border-0 shadow-lg ${animateForm ? 'animate__animated animate__fadeIn' : 'opacity-0'}`} 
                 style={{ borderRadius: '1rem' }}>
              
              {/* Header */}
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i className="bi bi-person-plus display-4 text-dark"></i>
                  </div>
                  <h2 className="h4 fw-bold text-dark mb-2">Create Account</h2>
                  <p className="text-muted small mb-0">Join FlexiFi today</p>
                </div>

                <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      id="username"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      required
                      disabled={isSubmitting}
                      autoComplete="username"
                    />
                    <label htmlFor="username">Username</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      disabled={isSubmitting}
                      autoComplete="new-password"
                      minLength="6"
                    />
                    <label htmlFor="password">Password</label>
                    <button
                      type="button"
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                      tabIndex="-1"
                      style={{ zIndex: 5 }}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                    <div className="form-text small">
                      <i className="bi bi-info-circle me-1"></i>
                      Minimum 6 characters
                    </div>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className={`form-control ${confirmPassword && password !== confirmPassword ? 'is-invalid' : ''}`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      required
                      disabled={isSubmitting}
                      autoComplete="new-password"
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <button
                      type="button"
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isSubmitting}
                      tabIndex="-1"
                      style={{ zIndex: 5 }}
                    >
                      <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                    {confirmPassword && password !== confirmPassword && (
                      <div className="invalid-feedback">
                        Passwords do not match
                      </div>
                    )}
                  </div>

                  <div className="form-floating mb-4">
                    <input
                      type="text"
                      id="activationCode"
                      className="form-control"
                      value={activationCode}
                      onChange={(e) => setActivationCode(e.target.value)}
                      placeholder="Activation Code"
                      required
                      disabled={isSubmitting}
                    />
                    <label htmlFor="activationCode">Activation Code</label>
                    <div className="form-text small">
                      <i className="bi bi-info-circle me-1"></i>
                      Contact <a href="https://t.me/rzvabelioprtma">administrator</a> for activation code
                    </div>
                  </div>

                  <div className="d-grid gap-2 mb-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg" 
                      disabled={isSubmitting || !isFormValid}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Create Account
                        </>
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/')}
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Back to Login
                    </button>
                  </div>
                </form>

                {/* Security Notice */}
                <div className="alert alert-light border p-3">
                  <h6 className="alert-heading fw-semibold mb-2">
                    <i className="bi bi-shield-check me-2"></i>
                    Security Information
                  </h6>
                  <ul className="list-unstyled mb-0 small">
                    <li className="mb-1">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      All passwords are encrypted and secure
                    </li>
                    <li className="mb-1">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Registration requires valid activation code
                    </li>
                    <li className="mb-0">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Your account data is protected and private
                    </li>
                  </ul>
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