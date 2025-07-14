import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const RegisterPage = ({ showToast }) => {
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
    // Trigger animation after component mounts
    setTimeout(() => setAnimateForm(true), 100);
  }, []);

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
    }
  };

  const isFormValid = username && password && confirmPassword && activationCode && password === confirmPassword;

  return (
    <div className="register-page-container min-vh-100 d-flex align-items-center" 
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
                          <i className="bi bi-person-plus-fill display-4 text-white"></i>
                        </div>
                        <h1 className="display-5 fw-bold text-white mb-2">Daftar Akun</h1>
                        <p className="lead text-white-50 mb-0">Buat akun baru untuk FlexiFi</p>
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
                
                {/* Right Side - Register Form */}
                <div className="col-lg-6 bg-white">
                  <div className="p-4 p-md-5 h-100 d-flex flex-column">
                    <div className="text-center d-block d-lg-none mb-4">
                      <i className="bi bi-person-plus-fill text-primary display-5"></i>
                      <h2 className="h3 fw-bold text-primary">FlexiFi</h2>
                    </div>
                    
                    <div className="text-center mb-4 mt-lg-2">
                      <h2 className="h3 fw-bold text-primary mb-2">Buat Akun Baru</h2>
                      <p className="text-muted mb-4">Lengkapi data berikut untuk mendaftar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                      <div className="form-floating mb-3">
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

                      <div className="form-floating mb-3">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          className="form-control form-control-lg border-2"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          required
                          disabled={isSubmitting}
                          autoComplete="new-password"
                          minLength="6"
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
                        <div className="form-text small">
                          <i className="bi bi-info-circle me-1"></i>
                          Minimal 6 karakter
                        </div>
                      </div>

                      <div className="form-floating mb-3">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          className={`form-control form-control-lg border-2 ${confirmPassword && password !== confirmPassword ? 'is-invalid' : ''}`}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Konfirmasi Password"
                          required
                          disabled={isSubmitting}
                          autoComplete="new-password"
                          style={{ borderRadius: '12px' }}
                        />
                        <label htmlFor="confirmPassword">Konfirmasi Password</label>
                        <button
                          type="button"
                          className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-decoration-none"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isSubmitting}
                          tabIndex="-1"
                          style={{ zIndex: 5 }}
                        >
                          <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'} text-primary`}></i>
                        </button>
                        {confirmPassword && password !== confirmPassword && (
                          <div className="invalid-feedback">
                            Password tidak cocok
                          </div>
                        )}
                      </div>

                      <div className="form-floating mb-4">
                        <input
                          type="text"
                          id="activationCode"
                          className="form-control form-control-lg border-2"
                          value={activationCode}
                          onChange={(e) => setActivationCode(e.target.value)}
                          placeholder="Kode Aktivasi"
                          required
                          disabled={isSubmitting}
                          style={{ borderRadius: '12px' }}
                        />
                        <label htmlFor="activationCode">Kode Aktivasi</label>
                        <div className="form-text small">
                          <i className="bi bi-info-circle me-1"></i>
                          Hubungi <a href="https://t.me/rzvabelioprtma" className="text-primary">administrator</a> untuk mendapatkan kode aktivasi
                        </div>
                      </div>

                      <div className="d-grid gap-2 mb-4">
                        <button 
                          type="submit" 
                          className="btn btn-primary btn-lg fw-semibold" 
                          disabled={isSubmitting || !isFormValid}
                          style={{ borderRadius: '12px', padding: '0.8rem 1rem' }}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Mendaftar...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-person-plus-fill me-2"></i>
                              Daftar Sekarang
                            </>
                          )}
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary"
                          onClick={() => navigate('/')}
                          disabled={isSubmitting}
                          style={{ borderRadius: '12px', padding: '0.6rem 1rem' }}
                        >
                          <i className="bi bi-arrow-left me-2"></i>
                          Kembali ke Login
                        </button>
                      </div>
                    </form>

                    {/* Security Notice */}
                    <div className="mt-auto">
                      <div className="alert alert-light border rounded-3 p-3">
                        <h6 className="alert-heading text-primary fw-bold mb-2">
                          <i className="bi bi-shield-check-fill me-2"></i>
                          Informasi Keamanan
                        </h6>
                        <ul className="list-unstyled mb-0 small">
                          <li className="mb-2">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            Semua password dienkripsi dan aman
                          </li>
                          <li className="mb-2">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            Pendaftaran memerlukan kode aktivasi yang valid
                          </li>
                          <li className="mb-0">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            Data akun Anda dilindungi dan bersifat privat
                          </li>
                        </ul>
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

export default RegisterPage;