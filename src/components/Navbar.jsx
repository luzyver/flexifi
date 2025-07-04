import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout, username }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLogoutClick = () => {
    setIsNavOpen(false);
    onLogout();
  };

  return (
    <nav className={`navbar ${isNavOpen ? 'navbar-expanded' : ''}`}>
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">Money Tracker</Link>
      </div>
      <div className={`navbar-center ${isNavOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-link" onClick={() => setIsNavOpen(false)}>Home</Link>
        <Link to="/history" className="nav-link" onClick={() => setIsNavOpen(false)}>History</Link>
        {username === 'rezz' && (
          <Link to="/register" className="nav-link" onClick={() => setIsNavOpen(false)}>Register</Link>
        )}
        <a href="#" onClick={handleLogoutClick} className="nav-link">
          Logout
        </a>
      </div>
      <div className="navbar-right">
        <button className="hamburger-icon" onClick={toggleNav}>
          &#9776;
        </button>
      </div>
    </nav>
  );
};

export default Navbar;