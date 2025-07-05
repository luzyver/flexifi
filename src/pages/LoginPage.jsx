
import React, { useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';
import Header from '../components/Header'; // Import Header component

const LoginPage = ({ onLogin, showToast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        showToast('Login successful!', 'success');
        setTimeout(() => {
          setLoading(true);
          onLogin(data.username, data.token);
        }, 3000); // Delay matches toast duration
      } else {
        showToast(data.error || 'Invalid username or password', 'error');
      }
    } catch (err) {
      showToast('Server error. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-container flex-grow-1 d-flex flex-column">
      <Header />
      <div className="container d-flex justify-content-center align-items-center flex-grow-1">
        <div className="card p-4 shadow-lg border-0 rounded-3" style={{ maxWidth: '400px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <h2 className="text-center mb-4 text-primary">Login</h2>
          <form onSubmit={handleSubmit}>
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
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
        <LoadingOverlay isLoading={loading} />
      </div>
    </div>
  );
};

export default LoginPage;
