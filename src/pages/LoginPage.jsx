import React, { useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';

const LoginPage = ({ onLogin, showToast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        // Langsung panggil onLogin tanpa delay dan tanpa mengatur loading
        // karena loading sudah diatur di App.jsx
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
    <div className="login-page-container">
      <div className="container-fluid h-100">
        <div className="row h-100 align-items-center justify-content-center">
          <div className="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-4">
            {/* Logo/Brand Section */}
            <div className="text-center mb-4 mb-md-5 fade-in">
              <div className="login-brand-icon mb-3">
                <i className="bi bi-wallet2 display-3 text-white"></i>
              </div>
              <h1 className="display-5 fw-bold text-white mb-2">FlexiFi</h1>
              <p className="lead text-white-50 mb-0">Manage your finances with ease</p>
            </div>

            {/* Login Card */}
            <div className="card login-card shadow-xl border-0 fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="h3 fw-bold text-primary mb-2">Welcome Back</h2>
                  <p className="text-muted mb-0">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                  <div className="mb-3">
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
                      placeholder="Enter your username"
                      required
                      disabled={isSubmitting}
                      autoComplete="username"
                    />
                  </div>

                  <div className="mb-4">
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
                        placeholder="Enter your password"
                        required
                        disabled={isSubmitting}
                        autoComplete="current-password"
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
                  </div>

                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg fw-semibold" 
                      disabled={isSubmitting || !username || !password}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Signing in...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Sign In
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Additional Info */}
                <div className="text-center mt-4 pt-3 border-top">
                  <div className="mb-3">
                    <a href="/register" className="btn btn-outline-primary">
                      <i className="bi bi-person-plus me-2"></i>
                      Register
                    </a>
                  </div>
                  <small className="text-muted">
                    <i className="bi bi-shield-check me-1"></i>
                    Your data is secure and encrypted
                  </small>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4 fade-in" style={{ animationDelay: '0.4s' }}>
              <small className="text-white-50">
                &copy; {new Date().getFullYear()} FlexiFi. All rights reserved.
              </small>
            </div>
          </div>
        </div>
      </div>
      {/* LoadingOverlay dipindahkan ke App.jsx */}
    </div>
  );
};

export default LoginPage;