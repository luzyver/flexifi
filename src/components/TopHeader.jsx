import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import DateRangeFilter from './DateRangeFilter';

const TopHeader = ({ 
  onLogout, 
  username, 
  filterMonth, 
  setFilterMonth, 
  availableMonths, 
  transactions,
  onMobileMenuToggle 
}) => {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const handleLogoutClick = () => {
    onLogout();
  };

  const showFilters = location.pathname === '/' || location.pathname === '/history';

  return (
    <div className="top-header">
      <div className="top-header-left">
        {/* Mobile Menu Toggle */}
        <button
          className="modern-btn modern-btn-outline modern-btn-sm d-md-none"
          onClick={onMobileMenuToggle}
          aria-label="Toggle menu"
        >
          <i className="bi bi-list"></i>
        </button>

        {/* Page Title */}
        <div className="d-none d-md-block">
          <h5 className="mb-0 fw-semibold text-primary">
            {location.pathname === '/' && 'Dashboard'}
            {location.pathname === '/add-transaction' && 'Add Transaction'}
            {location.pathname === '/history' && 'Transaction History'}
            {location.pathname === '/categories' && 'Categories'}
            {location.pathname === '/change-password' && 'Change Password'}
            {location.pathname === '/activation-codes' && 'Activation Codes'}
          </h5>
        </div>
      </div>

      <div className="top-header-right">
        {/* Filter Controls - Desktop */}
        {showFilters && (
          <div className="header-filter-controls">
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

        {/* Mobile Filter Toggle */}
        {showFilters && (
          <button className="modern-btn modern-btn-outline modern-btn-sm mobile-filter-toggle">
            <i className="bi bi-funnel"></i>
          </button>
        )}
        
        {/* Theme Toggle */}
        <button
          className="theme-toggle-header"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
        </button>
        
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
            <span className="d-none d-sm-inline">{username}</span>
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
  );
};

export default TopHeader;