import React, { useState } from 'react';
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
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleSubmit} className="card p-4 shadow-lg border-0 rounded-3" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4 text-primary">Register Account</h2>
        
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            className="form-control form-control-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control form-control-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
            autoComplete="new-password"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="registerCode" className="form-label">Registration Code</label>
          <input
            type="text"
            id="registerCode"
            className="form-control form-control-lg"
            value={registerCode}
            onChange={(e) => setRegisterCode(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
      <LoadingOverlay isLoading={loading} />
    </div>
  );
};

export default RegisterPage;
