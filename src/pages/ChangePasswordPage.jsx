import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const ChangePasswordPage = ({ showToast }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      return;
    }

    if (currentPassword === newPassword) {
      showToast('New password must be different from current password', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Authentication token not found. Please log in.', 'error');
        navigate('/');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Password changed successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          localStorage.removeItem('token');
          localStorage.removeItem('sessionId');
          navigate('/');
        } else {
          showToast(data.error || 'Failed to change password', 'error');
        }
      }
    } catch (error) {
      showToast('Error changing password: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = currentPassword && newPassword && confirmNewPassword && 
                     newPassword === confirmNewPassword && newPassword.length >= 6;

  return (
    <div className="login-page-container min-vh-100 d-flex align-items-center">
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
            <div className="card border-0 shadow-lg animate__animated animate__fadeIn" 
                 style={{ borderRadius: '1rem' }}>
              
              {/* Header */}
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i className="bi bi-shield-lock display-4 text-dark"></i>
                  </div>
                  <h2 className="h4 fw-bold text-dark mb-2">Change Password</h2>
                  <p className="text-muted small mb-0">Update your account security</p>
                </div>

                <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                  {/* Current Password */}
                  <div className="form-floating mb-3">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      className="form-control"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current Password"
                      required
                      disabled={isSubmitting}
                      autoComplete="current-password"
                    />
                    <label htmlFor="currentPassword">Current Password</label>
                    <button
                      type="button"
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      disabled={isSubmitting}
                      tabIndex="-1"
                      style={{ zIndex: 5 }}
                    >
                      <i className={`bi ${showCurrentPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>

                  {/* New Password */}
                  <div className="form-floating mb-3">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password"
                      required
                      disabled={isSubmitting}
                      autoComplete="new-password"
                      minLength="6"
                    />
                    <label htmlFor="newPassword">New Password</label>
                    <button
                      type="button"
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={isSubmitting}
                      tabIndex="-1"
                      style={{ zIndex: 5 }}
                    >
                      <i className={`bi ${showNewPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                    <div className="form-text small">
                      <i className="bi bi-info-circle me-1"></i>
                      Minimum 6 characters
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="form-floating mb-4">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmNewPassword"
                      className={`form-control ${
                        confirmNewPassword && newPassword !== confirmNewPassword ? 'is-invalid' : ''
                      }`}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm New Password"
                      required
                      disabled={isSubmitting}
                      autoComplete="new-password"
                    />
                    <label htmlFor="confirmNewPassword">Confirm New Password</label>
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
                    {confirmNewPassword && newPassword !== confirmNewPassword && (
                      <div className="invalid-feedback">
                        Passwords do not match
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid mb-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg" 
                      disabled={isSubmitting || !isFormValid}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle-fill me-2"></i>
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Back Button */}
                <div className="text-center">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/')}
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* Security Tips Card */}
            <div className="card mt-4 border-0 shadow-lg animate__animated animate__fadeIn" 
                 style={{ borderRadius: '1rem', animationDelay: '0.2s' }}>
              <div className="card-body p-4">
                <h6 className="card-title fw-semibold mb-3 text-center">
                  <i className="bi bi-shield-check me-2 text-success"></i>
                  Security Tips
                </h6>
                <ul className="list-unstyled mb-0 small text-muted">
                  <li className="mb-2 d-flex align-items-start">
                    <i className="bi bi-check-circle text-success me-2 mt-1 flex-shrink-0"></i>
                    <span>Use a strong password with at least 6 characters</span>
                  </li>
                  <li className="mb-2 d-flex align-items-start">
                    <i className="bi bi-check-circle text-success me-2 mt-1 flex-shrink-0"></i>
                    <span>Include a mix of letters, numbers, and symbols</span>
                  </li>
                  <li className="mb-2 d-flex align-items-start">
                    <i className="bi bi-check-circle text-success me-2 mt-1 flex-shrink-0"></i>
                    <span>Don't reuse passwords from other accounts</span>
                  </li>
                  <li className="mb-0 d-flex align-items-start">
                    <i className="bi bi-check-circle text-success me-2 mt-1 flex-shrink-0"></i>
                    <span>Keep your password private and secure</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;