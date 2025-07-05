import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white text-center p-3 mt-auto">
      <div className="container">
        <p className="mb-0">&copy; {new Date().getFullYear()} Money Tracker. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
