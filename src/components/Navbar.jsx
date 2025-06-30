import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">Money Tracker</Link>
      </div>
      <div className={`navbar-center ${isNavOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-link" onClick={() => setIsNavOpen(false)}>Home</Link>
        <Link to="/history" className="nav-link" onClick={() => setIsNavOpen(false)}>History</Link>
      </div>
      <div className="navbar-right">
        <button className="hamburger-icon" onClick={toggleNav}>
          &#9776; {/* Hamburger icon */}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;