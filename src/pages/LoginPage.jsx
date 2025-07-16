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
            <div className={`card border-0 shadow-lg ${animateForm ? 'animate__animated animate__fadeIn' : 'opacity-0'}`} 
                 style={{ borderRadius: '1rem' }}>
              
              {/* Header */}
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i className="bi bi-wallet2 display-4 text-dark"></i>
                  </div>
                  <h2 className="h4 fw-bold text-dark mb-2">Welcome Back</h2>
                  <p className="text-muted small mb-0">Sign in to your account</p>
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

                  <div className="form-floating mb-4">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      disabled={isSubmitting}
                      autoComplete="current-password"
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
                  </div>

                  <div className="d-grid mb-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg" 
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

                {/* Footer */}
                <div className="text-center">
                  <p className="text-muted small mb-3">Don't have an account?</p>
                  <Link to="/register" className="btn btn-outline-primary">
                    <i className="bi bi-person-plus me-2"></i>
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