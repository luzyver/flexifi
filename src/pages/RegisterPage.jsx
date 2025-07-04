import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './LoginPage.css';
import LoadingOverlay from '../components/LoadingOverlay';

const RegisterPage = ({ showToast, token }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerCode, setRegisterCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password, registerCode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Registration successful! You can now log in.', 'success');
        setUsername('');
        setPassword('');
        setRegisterCode('');
      } else {
        showToast(data.error || 'Registration failed. Please try again.', 'error');
      }
    } catch (err) {
      showToast('Server error. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Register Account</h2>
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="registerCode">Registration Code</label>
          <input
            type="text"
            id="registerCode"
            value={registerCode}
            onChange={(e) => setRegisterCode(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
      <LoadingOverlay isLoading={loading} />
    </div>
  );
};

RegisterPage.propTypes = {
  showToast: PropTypes.func.isRequired,
};

export default RegisterPage;
