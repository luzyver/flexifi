import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Shield, Key, ArrowLeft, Check } from 'lucide-react';
import PasswordStrengthMeter from '../components/common/PasswordStrengthMeter';
import { API_BASE_URL } from '../services/api';

const ChangePasswordPage = ({ showToast }) => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isFormValid = useMemo(
    () =>
      currentPassword &&
      newPassword &&
      confirmNewPassword &&
      newPassword === confirmNewPassword &&
      newPassword.length >= 6,
    [currentPassword, newPassword, confirmNewPassword]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (newPassword !== confirmNewPassword) {
        showToast('Password baru tidak cocok', 'error');
        return;
      }

      if (newPassword.length < 6) {
        showToast('Password minimal 6 karakter', 'error');
        return;
      }

      if (currentPassword === newPassword) {
        showToast('Password baru harus berbeda', 'error');
        return;
      }

      setIsSubmitting(true);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          showToast('Silakan login ulang', 'error');
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
          showToast('Password berhasil diubah!', 'success');
          setTimeout(() => navigate('/'), 1500);
        } else {
          showToast(data.error || 'Gagal mengubah password', 'error');
        }
      } catch (error) {
        showToast('Error: ' + error.message, 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentPassword, newPassword, confirmNewPassword, showToast, navigate]
  );

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Key className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ubah Password</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Perbarui keamanan akun Anda</p>
        </div>
      </div>

      {/* Form */}
      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Password Saat Ini
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan password saat ini"
                required
                disabled={isSubmitting}
                className="input-modern pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Password Baru
            </label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan password baru"
                required
                disabled={isSubmitting}
                className="input-modern pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <PasswordStrengthMeter password={newPassword} />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Ulangi password baru"
                required
                disabled={isSubmitting}
                className="input-modern pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmNewPassword && newPassword !== confirmNewPassword && (
              <p className="text-sm text-rose-600 mt-1">Password tidak cocok</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Batal
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Simpan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-slate-900 dark:text-white">Tips Keamanan</h3>
        </div>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            Gunakan minimal 6 karakter
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            Kombinasikan huruf dan angka
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            Jangan gunakan password yang sama
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
