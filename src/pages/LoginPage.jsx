import { useState, useEffect } from 'react';
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
        showToast('Login berhasil!', 'success');
        onLogin(data.username, data.token, data.sessionId);
      } else {
        showToast(data.error || 'Nama pengguna atau kata sandi tidak valid', 'error');
      }
    } catch (err) {
      showToast('Kesalahan server. Silakan coba lagi nanti.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Background */}
      <div className="auth-background">
        <div className="auth-bg-shape auth-bg-shape-1"></div>
        <div className="auth-bg-shape auth-bg-shape-2"></div>
        <div className="auth-bg-shape auth-bg-shape-3"></div>
      </div>

      {/* Theme Toggle */}
      <button
        className="auth-theme-toggle"
        onClick={toggleDarkMode}
        aria-label="Toggle theme"
      >
        <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
      </button>

      {/* Main Content */}
      <div className="auth-content">
        <div className="auth-left">
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <i className="bi bi-wallet2"></i>
            </div>
            <h1 className="auth-brand-title">FlexiFi</h1>
            <p className="auth-brand-subtitle">Manajemen Keuangan Cerdas</p>
          </div>
          
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
              <div>
                <h3>Lacak Pengeluaran</h3>
                <p>Pantau pola pengeluaran dan kebiasaan keuangan Anda</p>
              </div>
            </div>
            
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <i className="bi bi-pie-chart"></i>
              </div>
              <div>
                <h3>Perencanaan Anggaran</h3>
                <p>Buat dan kelola anggaran untuk kontrol keuangan yang lebih baik</p>
              </div>
            </div>
            
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <i className="bi bi-shield-check"></i>
              </div>
              <div>
                <h3>Aman & Privat</h3>
                <p>Data keuangan Anda dienkripsi dan dilindungi</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className={`auth-form-container ${animateForm ? 'animate-in' : ''}`}>
            <div className="auth-form-header">
              <h2>Selamat Datang Kembali</h2>
              <p>Masuk ke akun FlexiFi Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="row-inputs">
                <div className="auth-input-group">
                  <label htmlFor="username">Nama Pengguna</label>
                  <div className="auth-input-wrapper">
                    <i className="bi bi-person"></i>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Masukkan nama pengguna"
                      required
                      disabled={isSubmitting}
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label htmlFor="password">Kata Sandi</label>
                  <div className="auth-input-wrapper">
                    <i className="bi bi-lock"></i>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      required
                      disabled={isSubmitting}
                      autoComplete="current-password"
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
                </div>
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn" 
                disabled={isSubmitting || !username || !password}
              >
                {isSubmitting ? (
                  <>
                    <div className="auth-spinner"></div>
                    Sedang Masuk...
                  </>
                ) : (
                  <>
                    Masuk
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>Belum punya akun?</span>
            </div>

            <Link to="/register" className="auth-secondary-btn">
              Buat Akun
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;