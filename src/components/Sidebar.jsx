import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ username, isMobileOpen, onMobileClose }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isMobileOpen ? 'show' : ''}`}
        onClick={onMobileClose}
      ></div>
      
      {/* Sidebar */}
      <div className={`sidebar ${isMobileOpen ? 'show' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <Link to="/" className="sidebar-brand-link" onClick={handleLinkClick}>
            <i className="bi bi-wallet2"></i>
            <span>FlexiFi</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-item">
            <Link 
              to="/" 
              className={`sidebar-nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <div className="sidebar-nav-icon">
                <i className="bi bi-house-door"></i>
              </div>
              <span>Dasbor</span>
            </Link>
          </div>

          <div className="sidebar-nav-item">
            <Link 
              to="/add-transaction" 
              className={`sidebar-nav-link ${isActive('/add-transaction') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <div className="sidebar-nav-icon">
                <i className="bi bi-plus-circle"></i>
              </div>
              <span>Tambah Transaksi</span>
            </Link>
          </div>

          <div className="sidebar-nav-item">
            <Link 
              to="/history" 
              className={`sidebar-nav-link ${isActive('/history') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <div className="sidebar-nav-icon">
                <i className="bi bi-clock-history"></i>
              </div>
              <span>Riwayat Transaksi</span>
            </Link>
          </div>

          <div className="sidebar-nav-item">
            <Link 
              to="/categories" 
              className={`sidebar-nav-link ${isActive('/categories') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <div className="sidebar-nav-icon">
                <i className="bi bi-tags"></i>
              </div>
              <span>Kategori</span>
            </Link>
          </div>

          {username === 'rezz' && (
            <div className="sidebar-nav-item">
              <Link 
                to="/activation-codes" 
                className={`sidebar-nav-link ${isActive('/activation-codes') ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <div className="sidebar-nav-icon">
                  <i className="bi bi-key"></i>
                </div>
                <span>Kode Aktivasi</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;