import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// Components
import {
  AuthLayout,
  FormInput,
  SubmitButton,
  LinkButton,
  SecurityNotice
} from '../components/auth';

// Hooks
import useAuth from '../hooks/useAuth';

/**
 * LoginPage - Halaman login aplikasi
 * 
 * @param {Object} props - Props komponen
 * @param {Function} props.onLogin - Callback yang dipanggil ketika login berhasil
 * @param {Function} props.showToast - Fungsi untuk menampilkan toast notification
 */
const LoginPage = ({ onLogin, showToast }) => {
  // Menggunakan custom hook untuk autentikasi
  const {
    username,
    setUsername,
    password,
    setPassword,
    isSubmitting,
    showPassword,
    animateForm,
    handleLogin,
    togglePasswordVisibility,
    enableFormAnimation
  } = useAuth(showToast, onLogin);

  // Mengaktifkan animasi setelah komponen dimount
  useEffect(() => {
    enableFormAnimation();
  }, [enableFormAnimation]);

  // Render form login
  const renderLoginForm = () => (
    <>
      <div className="text-center mb-4 mt-lg-4">
        <h2 className="h3 fw-bold text-primary mb-2">Selamat Datang Kembali!</h2>
        <p className="text-muted mb-4">Masuk ke akun Anda untuk melanjutkan</p>
      </div>

      <form onSubmit={handleLogin} className="needs-validation" noValidate>
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
          autoComplete="current-password"
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={togglePasswordVisibility}
        />

        <div className="d-grid mb-4">
          <SubmitButton
            isSubmitting={isSubmitting}
            disabled={!username || !password}
            loadingText="Masuk..."
            defaultText="Masuk"
            icon="bi-box-arrow-in-right"
            variant="primary"
          />
        </div>
      </form>

      {/* Additional Info */}
      <div className="mt-auto">
        <p className="mb-3 text-center">Belum punya akun?</p>
        <div className="d-grid">
          <LinkButton 
            to="/register"
            text="Daftar Sekarang" 
            icon="bi-person-plus" 
            variant="outline-primary" 
          />
        </div>
        <div className="mt-3">
          <SecurityNotice 
            title="Informasi Keamanan" 
            items={['Data Anda aman dan terenkripsi']} 
          />
        </div>
      </div>
    </>
  );

  return (
    <AuthLayout
      title="FlexiFi"
      subtitle="Kelola keuangan dengan mudah dan efisien"
      icon="bi-wallet2"
      animateForm={animateForm}
    >
      {renderLoginForm()}
    </AuthLayout>
  );
};

export default LoginPage;