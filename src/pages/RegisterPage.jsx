import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';

const RegisterPage = ({ showToast }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
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
        showToast('Registration successful! Redirecting to dashboard...', 'success');
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
      setLoading(false);
    }
  };

  const isFormValid = username && password && confirmPassword && activationCode && password === confirmPassword;

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          {/* Header */}
          <div className="text-center mb-4 fade-in">
            <div className="mb-3">
              <i className="bi bi-person-plus display-4 text-primary"></i>
            </div>
            <h1 className="display-6 fw-bold text-white mb-2">Create Account</h1>
            <p className="lead text-white-50">Register a new user account</p>
          </div>

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4 fade-in" style={{ animationDelay: '0.1s' }}>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <button 
                  onClick={() => navigate('/')} 
                  className="btn btn-link text-white-50 text-decoration-none p-0"
                >
                  <i className="bi bi-house-door-fill me-1"></i>
                  Dashboard
                </button>
              </li>
              <li className="breadcrumb-item active text-white" aria-current="page">
                Register User
              </li>
            </ol>
          </nav>

          {/* Register Card */}
          <div className="card shadow-xl border-0 fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0 fw-semibold">
                <i className="bi bi-person-plus-fill me-2"></i>
                User Registration
              </h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="row g-3">
                  <div className="col-12">
                    <label htmlFor="username" className="form-label fw-semibold">
                      <i className="bi bi-person-fill me-2 text-primary"></i>
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="form-control form-control-lg"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      required
                      disabled={isSubmitting}
                      autoComplete="username"
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label fw-semibold">
                      <i className="bi bi-lock-fill me-2 text-primary"></i>
                      Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="form-control form-control-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        disabled={isSubmitting}
                        autoComplete="new-password"
                        minLength="6"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                        tabIndex="-1"
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                    <div className="form-text">
                      <small className="text-muted">Minimum 6 characters</small>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="confirmPassword" className="form-label fw-semibold">
                      <i className="bi bi-lock-fill me-2 text-primary"></i>
                      Confirm Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        className={`form-control form-control-lg ${confirmPassword && password !== confirmPassword ? 'is-invalid' : ''}`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        required
                        disabled={isSubmitting}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isSubmitting}
                        tabIndex="-1"
                      >
                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <div className="invalid-feedback">
                        Passwords do not match
                      </div>
                    )}
                  </div>

                  <div className="col-12">
                    <label htmlFor="activationCode" className="form-label fw-semibold">
                      <i className="bi bi-key-fill me-2 text-primary"></i>
                      Kode Aktivasi
                    </label>
                    <input
                      type="text"
                      id="activationCode"
                      className="form-control form-control-lg"
                      value={activationCode}
                      onChange={(e) => setActivationCode(e.target.value)}
                      placeholder="Masukkan kode aktivasi"
                      required
                      disabled={isSubmitting}
                    />
                    <div className="form-text">
                      <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Hubungi administrator untuk mendapatkan kode aktivasi
                      </small>
                    </div>
                  </div>

                  <div className="col-12 mt-4">
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-lg me-md-2"
                        onClick={() => navigate('/')}
                        disabled={isSubmitting}
                      >
                        <i className="bi bi-x-circle me-2"></i>
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
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-person-plus-fill me-2"></i>
                            Create Account
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Security Notice */}
          <div className="card mt-4 fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="card-body">
              <h6 className="card-title text-primary">
                <i className="bi bi-shield-check-fill me-2"></i>
                Security Notice
              </h6>
              <ul className="list-unstyled mb-0 small text-muted">
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  All passwords are encrypted and secure
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Pendaftaran memerlukan kode aktivasi yang valid
                </li>
                <li className="mb-0">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Account data is protected and private
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LoadingOverlay isLoading={loading} />
    </div>
  );
};

export default RegisterPage;