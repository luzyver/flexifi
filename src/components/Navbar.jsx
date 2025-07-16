import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = ({ onLogout, username, filterMonth, setFilterMonth, availableMonths }) => {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const handleLogoutClick = () => {
    onLogout();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold fs-4 text-dark">
          <i className="bi bi-wallet2 me-2"></i>
          FlexiFi
        </Link>
        
        <button
          className="navbar-toggler border-0"
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
                <i className="bi bi-house me-2"></i> 
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/add-transaction" className={`nav-link d-flex align-items-center ${isActive('/add-transaction')}`}>
                <i className="bi bi-plus-circle me-2"></i> 
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
                <i className="bi bi-gear me-2"></i> 
                Settings
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link to="/categories" className="dropdown-item d-flex align-items-center">
                    <i className="bi bi-tags me-2"></i> 
                    Categories
                  </Link>
                </li>
              </ul>
            </li>
            {username === 'rezz' && (
              <li className="nav-item">
                <Link to="/activation-codes" className={`nav-link d-flex align-items-center ${isActive('/activation-codes')}`}>
                  <i className="bi bi-key me-2"></i> 
                  Activation Codes
                </Link>
              </li>
            )}
          </ul>
          
          <button
            className="theme-toggle me-3"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
          </button>
          
          {(location.pathname === '/' || location.pathname === '/history') && (
            <div className="d-flex me-3 align-items-center">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-0">
                  <i className="bi bi-calendar3"></i>
                </span>
                <select
                  className="form-select form-select-sm"
                  id="monthFilter"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  aria-label="Filter by month"
                >
                  <option value="">All Months</option>
                  {availableMonths && availableMonths.map((month) => (
                    <option key={month} value={month}>
                      {new Date(month + '-02').toLocaleString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
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
                  <Link to="/change-password" className="dropdown-item d-flex align-items-center">
                    <i className="bi bi-key me-2"></i> 
                    Change Password
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
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