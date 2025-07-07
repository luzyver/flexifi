import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onLogout, username }) => {
  const location = useLocation();
  
  const handleLogoutClick = () => {
    onLogout();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold fs-4 text-primary">
          <i className="bi bi-wallet2 me-2"></i>
          Money Tracker
        </Link>
        
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
              <Link to="/" className={`nav-link d-flex align-items-center ${isActive('/')}`}>
                <i className="bi bi-house-door-fill me-2"></i> 
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/add-transaction" className={`nav-link d-flex align-items-center ${isActive('/add-transaction')}`}>
                <i className="bi bi-plus-circle-fill me-2"></i> 
                Add Transaction
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/history" className={`nav-link d-flex align-items-center ${isActive('/history')}`}>
                <i className="bi bi-clock-history me-2"></i> 
                History
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle d-flex align-items-center" 
                href="#" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <i className="bi bi-gear-fill me-2"></i> 
                Settings
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link to="/categories" className="dropdown-item d-flex align-items-center">
                    <i className="bi bi-tags-fill me-2"></i> 
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="/change-password" className="dropdown-item d-flex align-items-center">
                    <i className="bi bi-key-fill me-2"></i> 
                    Change Password
                  </Link>
                </li>
              </ul>
            </li>
            {username === 'rezz' && (
              <li className="nav-item">
                <Link to="/register" className={`nav-link d-flex align-items-center ${isActive('/register')}`}>
                  <i className="bi bi-person-plus-fill me-2"></i> 
                  Register
                </Link>
              </li>
            )}
          </ul>
          
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle d-flex align-items-center" 
                href="#" 
                id="userDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-2"></i> 
                {username}
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <span className="dropdown-item-text">
                    <small className="text-muted">Logged in as</small><br>
                    <strong>{username}</strong>
                  </span>
                </li>
                <li><hr className="dropdown-divider"></li>
                <li>
                  <a href="#" onClick={handleLogoutClick} className="dropdown-item d-flex align-items-center text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i> 
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;