import { useState, useEffect } from 'react';
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
      showToast('Kata sandi tidak cocok', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Kata sandi harus minimal 6 karakter', 'error');
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
        showToast('Pendaftaran berhasil! Mengalihkan...', 'success');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setActivationCode('');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        showToast(data.error || 'Pendaftaran gagal. Silakan coba lagi.', 'error');
      }
    } catch (err) {
      showToast('Kesalahan server. Silakan coba lagi nanti.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = username && password && confirmPassword && activationCode && password === confirmPassword;

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
              <i className="bi bi-person-plus"></i>
            </div>
            <h1 className="auth-brand-title">Bergabung dengan FlexiFi</h1>
            <p className="auth-brand-subtitle">Mulai perjalanan keuangan Anda hari ini</p>
          </div>
          
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <i className="bi bi-speedometer2"></i>
              </div>
              <div>
                <h3>Pengaturan Cepat</h3>
                <p>Mulai dalam hitungan menit dengan proses pendaftaran sederhana kami</p>
              </div>
            </div>
            
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <i className="bi bi-graph-up"></i>
              </div>
              <div>
                <h3>Analitik Cerdas</h3>
                <p>Dapatkan wawasan tentang pola pengeluaran dan tabungan Anda</p>
              </div>
            </div>
            
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <i className="bi bi-people"></i>
              </div>
              <div>
                <h3>Dipercaya oleh Pengguna</h3>
                <p>Bergabunglah dengan ribuan pengguna yang mengelola keuangan mereka</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className={`auth-form-container ${animateForm ? 'animate-in' : ''}`}>
            <div className="auth-form-header">
              <h2>Buat Akun</h2>
              <p>Bergabung dengan FlexiFi dan kendalikan keuangan Anda</p>
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
                      placeholder="Pilih nama pengguna"
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
                      placeholder="Buat kata sandi"
                      required
                      disabled={isSubmitting}
                      autoComplete="new-password"
                      minLength="6"
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
                  <div className="auth-input-help">
                    Minimal 6 karakter diperlukan
                  </div>
                </div>
              </div>

              <div className="row-inputs">
                <div className="auth-input-group">
                  <label htmlFor="confirmPassword">Konfirmasi Kata Sandi</label>
                  <div className="auth-input-wrapper">
                    <i className="bi bi-shield-check"></i>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className={confirmPassword && password !== confirmPassword ? 'error' : ''}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Konfirmasi kata sandi Anda"
                      required
                      disabled={isSubmitting}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isSubmitting}
                    >
                      <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <div className="auth-input-error">
                      Kata sandi tidak cocok
                    </div>
                  )}
                </div>

                <div className="auth-input-group">
                  <label htmlFor="activationCode">Kode Aktivasi</label>
                  <div className="auth-input-wrapper">
                    <i className="bi bi-key"></i>
                    <input
                      type="text"
                      id="activationCode"
                      value={activationCode}
                      onChange={(e) => setActivationCode(e.target.value)}
                      placeholder="Masukkan kode aktivasi"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="auth-input-help">
                    Hubungi <a href="https://t.me/rzvabelioprtma" target="_blank" rel="noopener noreferrer">administrator</a> untuk kode aktivasi
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn" 
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? (
                  <>
                    <div className="auth-spinner"></div>
                    Membuat Akun...
                  </>
                ) : (
                  <>
                    Buat Akun
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            <div className="auth-security-info">
              <div className="auth-security-header">
                <i className="bi bi-shield-check"></i>
                <span>Data Anda aman</span>
              </div>
              <div className="auth-security-items">
                <div className="auth-security-item">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Enkripsi end-to-end</span>
                </div>
                <div className="auth-security-item">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Privasi terlindungi</span>
                </div>
                <div className="auth-security-item">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Autentikasi aman</span>
                </div>
              </div>
            </div>

            <div className="auth-divider">
              <span>Sudah punya akun?</span>
            </div>

            <Link to="/" className="auth-secondary-btn">
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;