<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAPI } from '../App';

// Components
import {
  AuthLayout,
  FormInput,
  SubmitButton,
  LinkButton,
  SecurityNotice,
  PasswordStrengthMeter
} from '../components/auth';
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';
>>>>>>> parent of 8ef2c7d (Merge pull request #18 from luzyver/develop)
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';
>>>>>>> parent of 8ef2c7d (Merge pull request #18 from luzyver/develop)
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';
>>>>>>> parent of 8ef2c7d (Merge pull request #18 from luzyver/develop)

/**
 * RegisterPage - Halaman pendaftaran akun baru
 * 
 * @param {Object} props - Props komponen
 * @param {Function} props.showToast - Fungsi untuk menampilkan toast notification
 */
const RegisterPage = ({ showToast }) => {
  const navigate = useNavigate();
  
  // State untuk form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  const [animateForm, setAnimateForm] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Mengaktifkan animasi setelah komponen dimount
  useEffect(() => {
    setTimeout(() => setAnimateForm(true), 100);
  }, []);
=======
>>>>>>> parent of 8ef2c7d (Merge pull request #18 from luzyver/develop)
=======
>>>>>>> parent of 8ef2c7d (Merge pull request #18 from luzyver/develop)
=======
>>>>>>> parent of 8ef2c7d (Merge pull request #18 from luzyver/develop)

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi
    if (password !== confirmPassword) {
      showToast('Password tidak cocok', 'error');
      return;
    }

    if (password.length < 8) {
      showToast('Password harus minimal 8 karakter', 'error');
      return;
    }
    
    // Validasi kompleksitas password
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
    
    if (!(hasLowerCase && hasUpperCase && hasNumber)) {
      showToast('Password harus mengandung huruf besar, huruf kecil, dan angka', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const { response, data } = await fetchAPI(
        `${API_BASE_URL}/auth/register`,
        {
          method: 'POST',
          body: JSON.stringify({ username, password, activationCode }),
        }
      );

      if (response.ok && data.success) {
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

  // Validasi form
  const isFormValid = username && password && confirmPassword && activationCode && password === confirmPassword;

<<<<<<< HEAD
  // Render form registrasi
  const renderRegisterForm = () => (
    <>
      <div className="mb-3">
        <h2 className="h4 fw-bold text-primary mb-2">Buat Akun Baru</h2>
        <p className="text-muted small">Lengkapi data berikut untuk mendaftar</p>
      </div>

      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <FormInput
          id="username"
          type="text"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isSubmitting}
          autoComplete="username"
        />

        <FormInput
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
          autoComplete="new-password"
          minLength="8"
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
        <PasswordStrengthMeter password={password} />

        <FormInput
          id="confirmPassword"
          type="password"
          label="Konfirmasi Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isSubmitting}
          autoComplete="new-password"
          isInvalid={confirmPassword && password !== confirmPassword}
          invalidFeedback="Password tidak cocok"
          showPasswordToggle
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <FormInput
          id="activationCode"
          type="text"
          label="Kode Aktivasi"
          value={activationCode}
          onChange={(e) => setActivationCode(e.target.value)}
          required
          disabled={isSubmitting}
          helpText={
            <>
              Hubungi <a href="https://t.me/rzvabelioprtma" className="text-primary">administrator</a> untuk mendapatkan kode aktivasi
            </>
          }
        />

        <div className="d-grid gap-2 mb-3">
          <SubmitButton
            isSubmitting={isSubmitting}
            disabled={!isFormValid}
            loadingText="Mendaftar..."
            defaultText="Daftar"
            icon="bi-person-plus-fill"
            variant="primary"
          />
          <LinkButton 
            to="/"
            text="Kembali ke Login"
            icon="bi-arrow-left"
            variant="outline-secondary"
            disabled={isSubmitting}
          />
        </div>
      </form>

      {/* Security Notice */}
      <div className="mt-3">
        <SecurityNotice />
      </div>
    </>
  );

  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <AuthLayout
      title="Daftar Akun"
      subtitle="Buat akun baru untuk FlexiFi"
      icon="bi-person-plus-fill"
      animateForm={animateForm}
    >
      {renderRegisterForm()}
    </AuthLayout>
=======
  return (
=======
>>>>>>> parent of 8ef2c7d (Merge pull request #18 from luzyver/develop)
=======
>>>>>>> parent of 8ef2c7d (Merge pull request #18 from luzyver/develop)
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
>>>>>>> parent of 8ef2c7d (Merge pull request #18 from luzyver/develop)
  );
};

export default RegisterPage;