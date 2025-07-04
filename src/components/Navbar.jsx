import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
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
        <button onClick={handleLogoutClick} className="nav-link">
          Logout
        </button>
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