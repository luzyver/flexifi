import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb, IconButton } from './auth';

const Navbar = ({ onLogout, username, filterMonth, setFilterMonth, availableMonths }) => {
  const location = useLocation();
  
  const handleLogoutClick = () => {
    onLogout();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Fungsi getBreadcrumbItems dihapus karena breadcrumb tidak digunakan lagi

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm py-2 animate-fade-in">
        <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold text-primary">
          <i className="bi bi-wallet2"></i>
          FlexiFi
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
                <i className="bi bi-house-door"></i> 
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/add-transaction" className={`nav-link d-flex align-items-center ${isActive('/add-transaction')}`}>
                <i className="bi bi-plus-circle"></i> 
                <span>Tambah Transaksi</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/history" className={`nav-link d-flex align-items-center ${isActive('/history')}`}>
                <i className="bi bi-clock-history"></i> 
                <span>Riwayat</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/categories" className={`nav-link d-flex align-items-center ${isActive('/categories')}`}>
                <i className="bi bi-tags"></i> 
                <span>Kategori</span>
              </Link>
            </li>
            {username === 'rezz' && (
              <li className="nav-item">
                <Link to="/activation-codes" className={`nav-link d-flex align-items-center ${isActive('/activation-codes')}`}>
                  <i className="bi bi-key"></i> 
                  <span>Kode Aktivasi</span>
                </Link>
              </li>
            )}
          </ul>
          
          {location.pathname === '/' || location.pathname === '/history' ? (
            <div className="d-flex me-3 align-items-center">
              <select
                className="form-select form-select-sm"
                id="monthFilter"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                aria-label="Filter berdasarkan bulan"
              >
                <option value="">Semua Bulan</option>
                {availableMonths && availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {new Date(month + '-02').toLocaleString('id-ID', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-person-circle"></i>
                <span className="ms-1">{username}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li>
                  <Link to="/change-password" className="dropdown-item d-flex align-items-center">
                    <i className="bi bi-key me-2"></i>
                    <span>Ganti Password</span>
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a href="#" onClick={handleLogoutClick} className="dropdown-item d-flex align-items-center text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i>
                    <span>Keluar</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    </>
  );
};

export default Navbar;