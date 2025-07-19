import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import DateRangeFilter from './DateRangeFilter';

const Navbar = ({ onLogout, username, filterMonth, setFilterMonth, availableMonths, transactions }) => {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const handleLogoutClick = () => {
    onLogout();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="modern-navbar navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link to="/" className="modern-navbar-brand navbar-brand">
          <i className="bi bi-wallet2"></i>
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
              <Link to="/" className={`modern-nav-link nav-link ${isActive('/')}`}>
                <i className="bi bi-house me-2"></i> 
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/add-transaction" className={`modern-nav-link nav-link ${isActive('/add-transaction')}`}>
                <i className="bi bi-plus-circle me-2"></i> 
                Add Transaction
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/history" className={`modern-nav-link nav-link ${isActive('/history')}`}>
                <i className="bi bi-clock-history me-2"></i> 
                History
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a 
                className="modern-nav-link nav-link dropdown-toggle" 
                href="#" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <i className="bi bi-gear me-2"></i> 
                Settings
              </a>
              <ul className="dropdown-menu shadow-lg border-0" aria-labelledby="navbarDropdown">
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
                <Link to="/activation-codes" className={`modern-nav-link nav-link ${isActive('/activation-codes')}`}>
                  <i className="bi bi-key me-2"></i> 
                  Activation Codes
                </Link>
              </li>
            )}
          </ul>
          
          <div className="d-flex align-items-center gap-3">
            {/* Theme Toggle */}
            <button
              className="modern-btn modern-btn-outline modern-btn-sm"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
            </button>
            
            {/* Filter Controls */}
            {(location.pathname === '/' || location.pathname === '/history') && (
              <div className="d-flex align-items-center gap-2">
                <div className="input-group" style={{ minWidth: '200px' }}>
                  <span className="input-group-text bg-light border-0">
                    <i className="bi bi-calendar3"></i>
                  </span>
                  <select
                    className="form-select"
                    id="monthFilter"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    aria-label="Filter by month"
                  >
                    <option value="">All Months</option>
                    {availableMonths && availableMonths.length > 0 && (
                      <>
                        <optgroup label="By Year">
                          {[...new Set(availableMonths.map(month => month.split('-')[0]))].sort((a, b) => b - a).map((year) => (
                            <option key={`year-${year}`} value={`year-${year}`}>
                              {year}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="By Month">
                          {availableMonths.map((month) => (
                            <option key={month} value={month}>
                              {new Date(month + '-02').toLocaleString('en-US', { 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </option>
                          ))}
                        </optgroup>
                      </>
                    )}
                  </select>
                </div>
                <DateRangeFilter 
                  onFilterChange={(filter) => {
                    if (filter) {
                      setFilterMonth(`dateRange-${filter.startDate}-${filter.endDate}`);
                    } else {
                      setFilterMonth('');
                    }
                  }}
                  transactions={transactions}
                />
              </div>
            )}
            
            {/* User Menu */}
            <div className="dropdown">
              <button 
                className="modern-btn modern-btn-outline dropdown-toggle d-flex align-items-center" 
                type="button"
                id="userDropdown" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-2"></i> 
                {username}
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0" aria-labelledby="userDropdown">
                <li>
                  <Link to="/change-password" className="dropdown-item d-flex align-items-center">
                    <i className="bi bi-key me-2"></i> 
                    Change Password
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    onClick={handleLogoutClick} 
                    className="dropdown-item d-flex align-items-center text-danger border-0 bg-transparent w-100"
                  >
                    <i className="bi bi-box-arrow-right me-2"></i> 
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;