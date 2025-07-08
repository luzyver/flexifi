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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Mengaktifkan animasi setelah komponen dimount
  useEffect(() => {
    setTimeout(() => setAnimateForm(true), 100);
  }, []);

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
    }
  };

  // Validasi form
  const isFormValid = username && password && confirmPassword && activationCode && password === confirmPassword;

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
    <AuthLayout
      title="Daftar Akun"
      subtitle="Buat akun baru untuk FlexiFi"
      icon="bi-person-plus-fill"
      animateForm={animateForm}
    >
      {renderRegisterForm()}
    </AuthLayout>
  );
};

export default RegisterPage;