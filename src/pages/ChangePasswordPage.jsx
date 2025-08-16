import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import PageHeader from '../components/common/PageHeader';
import PasswordStrengthMeter from '../components/common/PasswordStrengthMeter';

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
      showToast('Kata sandi baru tidak cocok', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Kata sandi baru harus minimal 6 karakter', 'error');
      return;
    }

    if (currentPassword === newPassword) {
      showToast('Kata sandi baru harus berbeda dari kata sandi saat ini', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Token autentikasi tidak ditemukan. Silakan masuk.', 'error');
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
        showToast('Kata sandi berhasil diubah!', 'success');
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
          showToast(data.error || 'Gagal mengubah kata sandi', 'error');
        }
      }
    } catch (error) {
      showToast('Kesalahan mengubah kata sandi: ' + error.message, 'error');
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
            title="Ubah Kata Sandi"
            subtitle="Perbarui keamanan akun Anda"
            icon="bi-shield-lock"
          />

          {/* Change Password Form */}
          <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="card-header">
              <h6 className="mb-0 fw-semibold">
                <i className="bi bi-key me-2"></i>
                Pembaruan Kata Sandi
              </h6>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                {/* Current Password */}
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">
                    <i className="bi bi-lock me-2"></i>
                    Kata Sandi Saat Ini
                  </label>
                  <div className="input-group">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      className="form-control form-control-lg"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Masukkan kata sandi saat ini"
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
                    Kata Sandi Baru
                  </label>
                  <div className="input-group">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      className="form-control form-control-lg"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Masukkan kata sandi baru"
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
                  <PasswordStrengthMeter password={newPassword} />
                </div>

                {/* Confirm New Password */}
                <div className="mb-4">
                  <label htmlFor="confirmNewPassword" className="form-label">
                    <i className="bi bi-shield-check me-2"></i>
                    Konfirmasi Kata Sandi Baru
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
                      placeholder="Konfirmasi kata sandi baru Anda"
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
                      Kata sandi tidak cocok
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
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting || !isFormValid}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Memperbarui...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Perbarui Kata Sandi
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
                Tips Keamanan
              </h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-check-circle text-success me-2 mt-1 flex-shrink-0"></i>
                    <small className="text-muted">Gunakan minimal 6 karakter</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-check-circle text-success me-2 mt-1 flex-shrink-0"></i>
                    <small className="text-muted">Sertakan huruf dan angka</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-check-circle text-success me-2 mt-1 flex-shrink-0"></i>
                    <small className="text-muted">Jangan gunakan kembali kata sandi lama</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-check-circle text-success me-2 mt-1 flex-shrink-0"></i>
                    <small className="text-muted">Jaga kerahasiaan dan keamanannya</small>
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