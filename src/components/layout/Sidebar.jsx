import { NavLink } from 'react-router-dom';

const Sidebar = ({ username, isMobileOpen, onMobileClose }) => {
  const handleLinkClick = () => {
    onMobileClose?.();
  };

  const navItems = [
    { to: '/', icon: 'bi-house-door', label: 'Dasbor' },
    { to: '/add-transaction', icon: 'bi-plus-circle', label: 'Tambah Transaksi' },
    { to: '/history', icon: 'bi-clock-history', label: 'Riwayat Transaksi' },
    { to: '/categories', icon: 'bi-tags', label: 'Kategori' },
  ];

  if (username === 'rezz') {
    navItems.push({ to: '/activation-codes', icon: 'bi-key', label: 'Kode Aktivasi' });
  }

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? 'show' : ''}`}
        onClick={onMobileClose}
      />

      {/* Sidebar */}
      <div className={`sidebar ${isMobileOpen ? 'show' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <NavLink to="/" className="sidebar-brand-link" onClick={handleLinkClick}>
            <i className="bi bi-wallet2"></i>
            <span>FlexiFi</span>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map(({ to, icon, label }) => (
            <div className="sidebar-nav-item" key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `sidebar-nav-link ${isActive ? 'active' : ''}`
                }
                onClick={handleLinkClick}
              >
                <div className="sidebar-nav-icon">
                  <i className={`bi ${icon}`}></i>
                </div>
                <span>{label}</span>
              </NavLink>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;