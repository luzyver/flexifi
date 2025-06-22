// client/src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Buat file CSS baru untuk Navbar jika belum ada

const Navbar = () => { // Tidak ada props user atau onLogout
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">Money Tracker</Link>
      </div>
      <div className="navbar-center">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/history" className="nav-link">History</Link>
      </div>
      <div className="navbar-right">
        {/* Tidak ada tombol login/logout di sini */}
      </div>
    </nav>
  );
};

export default Navbar;