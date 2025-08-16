import { NavLink } from 'react-router-dom';
import { Home, Plus, Clock, Tags, Key, Wallet } from 'lucide-react';

const Sidebar = ({ username, isMobileOpen, onMobileClose }) => {
  const handleLinkClick = () => {
    onMobileClose?.();
  };

  const navItems = [
    { to: '/', icon: Home, label: 'Dasbor' },
    { to: '/add-transaction', icon: Plus, label: 'Tambah Transaksi' },
    { to: '/history', icon: Clock, label: 'Riwayat Transaksi' },
    { to: '/categories', icon: Tags, label: 'Kategori' },
  ];

  if (username === 'rezz') {
    navItems.push({ to: '/activation-codes', icon: Key, label: 'Kode Aktivasi' });
  }

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onMobileClose}
      />

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg z-50 transform transition-transform duration-300 lg:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <NavLink 
            to="/" 
            className="flex items-center space-x-3 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors" 
            onClick={handleLinkClick}
          >
            <Wallet className="w-8 h-8" />
            <span className="text-xl font-bold">FlexiFi</span>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-l-4 border-primary-600 dark:border-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
              onClick={handleLinkClick}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;