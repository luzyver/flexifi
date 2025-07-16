import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import PageHeader from '../components/PageHeader';

const ChangePasswordPage = ({ showToast }) => {
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
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Page Header */}
          <PageHeader
            title="Change Password"
            subtitle="Update your account security"
            icon="bi-shield-lock"
          />

          {/* Change Password Form */}
          <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="card-header">
              <h6 className="mb-0 fw-semibold">
                <i className="bi bi-key me-2"></i>
                Password Update
              </h6>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                {/* Current Password */}
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">
                    <i className="bi bi-lock me-2"></i>
                    Current Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      className="form-control form-control-lg"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      required
                      disabled={isSubmitting}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      disabled={isSubmitting}
                    >
                      <i className={`bi ${showCurrentPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    <i className="bi bi-shield-lock me-2"></i>
                    New Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      className="form-control form-control-lg"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      required
                      disabled={isSubmitting}
                      autoComplete="new-password"
                      minLength="6"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={isSubmitting}
                    >
                      <i className={`bi ${showNewPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  <div className="form-text">
                    <i className="bi bi-info-circle me-1"></i>
                    Minimum 6 characters required
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="mb-4">
                  <label htmlFor="confirmNewPassword" className="form-label">
                    <i className="bi bi-shield-check me-2"></i>
                    Confirm New Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmNewPassword"
                      className={`form-control form-control-lg ${
                        confirmNewPassword && newPassword !== confirmNewPassword ? 'is-invalid' : ''
                      }`}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      required
                      disabled={isSubmitting}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isSubmitting}
                    >
                      <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {confirmNewPassword && newPassword !== confirmNewPassword && (
                    <div className="invalid-feedback">
                      Passwords do not match
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-lg me-md-2"
                    onClick={() => navigate('/')}
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Cancel
                  </button>
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
            </div>
          </div>

          {/* Security Tips */}
          <div className="card mt-4 fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-body">
              <h6 className="card-title fw-semibold mb-3">
                <i className="bi bi-shield-check me-2 text-success"></i>
                Security Tips
              </h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-check-circle text-success me-2 mt-1 flex-shrink-0"></i>
                    <small className="text-muted">Use at least 6 characters</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-check-circle text-success me-2 mt-1 flex-shrink-0"></i>
                    <small className="text-muted">Include letters and numbers</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-check-circle text-success me-2 mt-1 flex-shrink-0"></i>
                    <small className="text-muted">Don't reuse old passwords</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-check-circle text-success me-2 mt-1 flex-shrink-0"></i>
                    <small className="text-muted">Keep it private and secure</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;