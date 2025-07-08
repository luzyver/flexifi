import React from 'react';

const Footer = () => {
  return (
    <footer className="footer bg-light text-center py-3 mt-auto">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-md-start">
            <p className="mb-0 text-muted">
              &copy; {new Date().getFullYear()} FlexiFi. All Rights Reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <small className="text-muted">
              Made with <i className="bi bi-heart-fill text-danger"></i> for better financial management
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;