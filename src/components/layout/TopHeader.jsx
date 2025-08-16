import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import DateRangeFilter from '../common/DateRangeFilter';
import { useState } from 'react';

const TopHeader = ({
  onLogout,
  username,
  setFilterMonth,
  transactions,
  onMobileMenuToggle
}) => {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const handleLogoutClick = () => {
    onLogout();
  };

  const showFilters = location.pathname === '/' || location.pathname === '/history';

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

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
            {location.pathname === '/' && 'Dasbor'}
            {location.pathname === '/add-transaction' && 'Tambah Transaksi'}
            {location.pathname === '/history' && 'Riwayat Transaksi'}
            {location.pathname === '/categories' && 'Kategori'}
            {location.pathname === '/change-password' && 'Ubah Kata Sandi'}
            {location.pathname === '/activation-codes' && 'Kode Aktivasi'}
          </h5>
        </div>
      </div>

      <div className="top-header-right">
        {/* Filter Controls - Desktop */}
        {showFilters && (
          <div className="header-filter-controls">

            <DateRangeFilter 
              onFilterChange={(filter) => {
                if (filter) {
                  if (filter.type === 'singleDate') {
                    setFilterMonth(`singleDate-${filter.selectedDate}`);
                  } else if (filter.type === 'byYear') {
                    setFilterMonth(`byYear-${filter.selectedYear}`);
                  } else if (filter.type === 'byMonth') {
                    setFilterMonth(`byMonth-${filter.selectedMonth}-${filter.selectedYear}`);
                  }
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
          <button 
            className="modern-btn modern-btn-outline modern-btn-sm mobile-filter-toggle"
            onClick={toggleMobileFilters}
          >
            <i className="bi bi-funnel"></i>
          </button>
        )}
        
        {/* Mobile Filters Dropdown */}
        {showFilters && showMobileFilters && (
          <div className="mobile-filters-dropdown">
            <div className="p-3">
              <h6 className="mb-3">Filter Transaksi</h6>
              

              <div className="mb-3">
                <label className="form-label small fw-semibold">Filter Tanggal</label>
                <DateRangeFilter 
                  onFilterChange={(filter) => {
                    if (filter) {
                      if (filter.type === 'singleDate') {
                        setFilterMonth(`singleDate-${filter.selectedDate}`);
                      } else if (filter.type === 'byYear') {
                        setFilterMonth(`byYear-${filter.selectedYear}`);
                      } else if (filter.type === 'byMonth') {
                        setFilterMonth(`byMonth-${filter.selectedMonth}-${filter.selectedYear}`);
                      }
                    } else {
                      setFilterMonth('');
                    }
                  }}
                  transactions={transactions}
                />
              </div>
              
              <button 
                className="btn btn-sm btn-outline-secondary w-100"
                onClick={toggleMobileFilters}
              >
                Tutup
              </button>
            </div>
          </div>
        )}
        
        {/* Theme Toggle */}
        <button
          className="theme-toggle-header"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          title={isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
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
                Ubah Kata Sandi
              </Link>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button 
                onClick={handleLogoutClick} 
                className="dropdown-item d-flex align-items-center text-danger border-0 bg-transparent w-100"
              >
                <i className="bi bi-box-arrow-right me-2"></i> 
                Keluar
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;