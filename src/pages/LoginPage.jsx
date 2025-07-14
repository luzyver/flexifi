import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

const LoginPage = ({ onLogin, showToast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
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
    <div className="login-page-container min-vh-100 d-flex align-items-center" 
         style={{
           background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
           backgroundSize: 'cover',
           backgroundAttachment: 'fixed'
         }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-10 col-md-8 col-lg-10 col-xl-9">
            <div className={`card border-0 shadow-lg overflow-hidden ${animateForm ? 'animate__animated animate__fadeIn' : 'opacity-0'}`} 
                 style={{ borderRadius: '20px', transition: 'all 0.3s ease' }}>
              <div className="row g-0">
                {/* Left Side - Brand/Image */}
                <div className="col-lg-6 d-none d-lg-block position-relative overflow-hidden">
                  <div className="h-100" style={{
                    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                    padding: '3rem'
                  }}>
                    <div className="position-relative h-100 d-flex flex-column justify-content-between z-index-1">
                      <div className="text-center mb-5">
                        <div className="mb-4 bg-white bg-opacity-10 p-3 rounded-circle d-inline-block">
                          <i className="bi bi-wallet2 display-4 text-white"></i>
                        </div>
                        <h1 className="display-5 fw-bold text-white mb-2">FlexiFi</h1>
                        <p className="lead text-white-50 mb-0">Kelola keuangan dengan mudah dan efisien</p>
                      </div>
                      
                      <div className="text-center mb-4">
                        <div className="row justify-content-center">
                          <div className="col-4">
                            <div className="feature-item text-center mb-4">
                              <div className="bg-white bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                <i className="bi bi-graph-up-arrow fs-3 text-white"></i>
                              </div>
                              <h5 className="text-white fs-6">Analisis Keuangan</h5>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="feature-item text-center mb-4">
                              <div className="bg-white bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                <i className="bi bi-shield-lock-fill fs-3 text-white"></i>
                              </div>
                              <h5 className="text-white fs-6">Keamanan Terjamin</h5>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="feature-item text-center mb-4">
                              <div className="bg-white bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                <i className="bi bi-currency-exchange fs-3 text-white"></i>
                              </div>
                              <h5 className="text-white fs-6">Kelola Transaksi</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <small className="text-white-50">
                          &copy; {new Date().getFullYear()} FlexiFi. All rights reserved.
                        </small>
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="position-absolute top-0 end-0 mt-4 me-4 d-none d-xl-block">
                      <i className="bi bi-circle-fill text-white opacity-10 fs-1"></i>
                    </div>
                    <div className="position-absolute bottom-0 start-0 mb-4 ms-4 d-none d-xl-block">
                      <i className="bi bi-circle-fill text-white opacity-10 display-1"></i>
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Login Form */}
                <div className="col-lg-6 bg-white">
                  <div className="p-4 p-md-5 h-100 d-flex flex-column">
                    <div className="text-center d-block d-lg-none mb-4">
                      <i className="bi bi-wallet2 text-primary display-5"></i>
                      <h2 className="h3 fw-bold text-primary">FlexiFi</h2>
                    </div>
                    
                    <div className="text-center mb-4 mt-lg-4">
                      <h2 className="h3 fw-bold text-primary mb-2">Selamat Datang Kembali!</h2>
                      <p className="text-muted mb-4">Masuk ke akun Anda untuk melanjutkan</p>
                    </div>

                    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                      <div className="form-floating mb-4">
                        <input
                          type="text"
                          id="username"
                          className="form-control form-control-lg border-2"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Username"
                          required
                          disabled={isSubmitting}
                          autoComplete="username"
                          style={{ borderRadius: '12px' }}
                        />
                        <label htmlFor="username">Username</label>
                      </div>

                      <div className="form-floating mb-4">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          className="form-control form-control-lg border-2"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          required
                          disabled={isSubmitting}
                          autoComplete="current-password"
                          style={{ borderRadius: '12px' }}
                        />
                        <label htmlFor="password">Password</label>
                        <button
                          type="button"
                          className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-decoration-none"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isSubmitting}
                          tabIndex="-1"
                          style={{ zIndex: 5 }}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-primary`}></i>
                        </button>
                      </div>

                      <div className="d-grid mb-4">
                        <button 
                          type="submit" 
                          className="btn btn-primary btn-lg fw-semibold" 
                          disabled={isSubmitting || !username || !password}
                          style={{ borderRadius: '12px', padding: '0.8rem 1rem' }}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Masuk...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-box-arrow-in-right me-2"></i>
                              Masuk
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                    {/* Additional Info */}
                    <div className="text-center mt-auto">
                      <p className="mb-3">Belum punya akun?</p>
                      <Link to="/register" className="btn btn-outline-primary px-4" style={{ borderRadius: '12px', padding: '0.6rem 1rem' }}>
                        <i className="bi bi-person-plus me-2"></i>
                        Daftar Sekarang
                      </Link>
                      <div className="mt-4 pt-3 border-top">
                        <div className="d-flex justify-content-center align-items-center gap-3">
                          <div className="bg-light p-2 rounded-circle">
                            <i className="bi bi-shield-check text-primary"></i>
                          </div>
                          <small className="text-muted">
                            Data Anda aman dan terenkripsi
                          </small>
                        </div>
                      </div>
                    </div>
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

export default LoginPage;