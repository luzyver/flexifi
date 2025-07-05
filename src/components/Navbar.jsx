import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout, username }) => {
  const handleLogoutClick = () => {
    onLogout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold fs-4">Money Tracker</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link d-flex align-items-center">
                <i className="bi bi-house-door-fill me-2"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/history" className="nav-link d-flex align-items-center">
                <i className="bi bi-clock-history me-2"></i> History
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-gear-fill me-2"></i> Settings
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link to="/categories" className="dropdown-item d-flex align-items-center">
                    <i className="bi bi-tags-fill me-2"></i> Categories
                  </Link>
                </li>
                <li>
                  <Link to="/change-password" className="dropdown-item d-flex align-items-center">
                    <i className="bi bi-key-fill me-2"></i> Change Password
                  </Link>
                </li>
              </ul>
            </li>
            {username === 'rezz' && (
              <li className="nav-item">
                <Link to="/register" className="nav-link d-flex align-items-center">
                  <i className="bi bi-person-plus-fill me-2"></i> Register
                </Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <span className="navbar-text text-white me-3 d-flex align-items-center">
                <i className="bi bi-person-circle me-2"></i> Logged in as: {username}
              </span>
            </li>
            <li className="nav-item">
              <a href="#" onClick={handleLogoutClick} className="nav-link d-flex align-items-center">
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;