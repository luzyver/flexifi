import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, FormInput, SubmitButton, Breadcrumb, PasswordStrengthMeter } from '../components/auth';
import { fetchAPI } from '../App';

const ChangePasswordPage = ({ showToast }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Token autentikasi tidak ditemukan. Silakan login.', 'error');
        navigate('/');
        return;
      }

      const { response, data } = await fetchAPI(
        `${API_BASE_URL}/auth/change-password`,
        {
          method: 'POST',
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      if (response.ok && data.success) {
        showToast('Kata sandi berhasil diubah!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        navigate('/'); // Redirect to home or profile page
      } else {
        // Periksa apakah sesi telah diinvalidasi (login di device lain)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          // Redirect ke halaman login
          localStorage.removeItem('token');
          localStorage.removeItem('sessionId');
          navigate('/');
        } else {
          showToast(data.error || 'Gagal mengubah kata sandi', 'error');
        }
      }
    } catch (error) {
      showToast('Error mengubah kata sandi: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      {/* Breadcrumb removed */}
      
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card 
            className="fade-in"
            title="Ubah Kata Sandi"
            titleClassName="text-center"
            icon="bi bi-shield-lock-fill"
            variant="primary"
          >
            <form onSubmit={handleSubmit}>
              <FormInput
                id="currentPassword"
                label="Kata Sandi Saat Ini"
                type="password"
                icon="bi bi-key-fill"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan kata sandi saat ini"
                required
              />
              
              <FormInput
                id="newPassword"
                label="Kata Sandi Baru"
                type="password"
                icon="bi bi-lock-fill"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan kata sandi baru"
                required
              />
              
              {newPassword && (
                <PasswordStrengthMeter password={newPassword} />
              )}
              
              <FormInput
                id="confirmNewPassword"
                label="Konfirmasi Kata Sandi Baru"
                type="password"
                icon="bi bi-check-circle-fill"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Konfirmasi kata sandi baru"
                required
              />
              
              <SubmitButton
                text="Ubah Kata Sandi"
                icon="bi bi-arrow-repeat"
                variant="primary"
                className="w-100 mt-4"
                isLoading={isLoading}
                loadingText="Mengubah..."
              />
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
