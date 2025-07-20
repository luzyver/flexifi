const Footer = () => {
  return (
    <footer className="footer bg-white text-center py-3 mt-auto">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-md-start">
            <p className="mb-0 text-muted small">
              &copy; {new Date().getFullYear()} FlexiFi. Hak Cipta Dilindungi.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <small className="text-muted">
              Dibuat dengan <i className="bi bi-heart-fill text-danger"></i> untuk manajemen keuangan yang lebih baik
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;