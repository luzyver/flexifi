import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import DateRangeFilter from '../common/DateRangeFilter';
import { useState } from 'react';

const TopHeader = ({
  onLogout,
  username,
  setFilterMonth,
  transactions,
  onMobileMenuToggle
}) => {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const showFilters = location.pathname === '/' || location.pathname === '/history';

  const handleLogoutClick = () => {
    onLogout();
    setMenuOpen(false);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b relative">
      <div className="flex items-center space-x-2">
        <button
          className="p-2 border rounded md:hidden"
          onClick={onMobileMenuToggle}
          aria-label="Toggle menu"
        >
          <i className="bi bi-list"></i>
        </button>
        <h5 className="hidden text-lg font-semibold text-blue-600 md:block">
          {location.pathname === '/' && 'Dasbor'}
          {location.pathname === '/add-transaction' && 'Tambah Transaksi'}
          {location.pathname === '/history' && 'Riwayat Transaksi'}
          {location.pathname === '/categories' && 'Kategori'}
          {location.pathname === '/change-password' && 'Ubah Kata Sandi'}
          {location.pathname === '/activation-codes' && 'Kode Aktivasi'}
        </h5>
      </div>

      <div className="flex items-center space-x-3">
        {showFilters && (
          <div className="hidden md:block">
            <DateRangeFilter
              onFilterChange={(filter) => {
                if (filter) {
                  if (filter.type === 'singleDate') {
                    setFilterMonth(`singleDate-${filter.selectedDate}`);
                  } else if (filter.type === 'byYear') {
                    setFilterMonth(`byYear-${filter.selectedYear}`);
                  } else if (filter.type === 'byMonth') {
                    setFilterMonth(`byMonth-${filter.selectedMonth}-${filter.selectedYear}`);
                  }
                } else {
                  setFilterMonth('');
                }
              }}
              transactions={transactions}
            />
          </div>
        )}

        {showFilters && (
          <button
            className="p-2 border rounded md:hidden"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <i className="bi bi-funnel"></i>
          </button>
        )}

        {showFilters && showMobileFilters && (
          <div className="absolute left-0 right-0 z-10 p-4 mt-2 bg-white border md:hidden">
            <DateRangeFilter
              onFilterChange={(filter) => {
                if (filter) {
                  if (filter.type === 'singleDate') {
                    setFilterMonth(`singleDate-${filter.selectedDate}`);
                  } else if (filter.type === 'byYear') {
                    setFilterMonth(`byYear-${filter.selectedYear}`);
                  } else if (filter.type === 'byMonth') {
                    setFilterMonth(`byMonth-${filter.selectedMonth}-${filter.selectedYear}`);
                  }
                } else {
                  setFilterMonth('');
                }
              }}
              transactions={transactions}
            />
            <button
              className="w-full px-3 py-2 mt-2 text-sm border rounded"
              onClick={() => setShowMobileFilters(false)}
            >
              Tutup
            </button>
          </div>
        )}

        <button
          className="p-2 border rounded"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
        </button>

        <div className="relative">
          <button
            className="flex items-center p-2 border rounded"
            onClick={() => setMenuOpen(!menuOpen)}
            id="userMenu"
          >
            <i className="bi bi-person-circle mr-2"></i>
            <span className="hidden sm:inline">{username}</span>
          </button>
          {menuOpen && (
            <ul className="absolute right-0 w-48 mt-2 bg-white border rounded shadow">
              <li>
                <Link
                  to="/change-password"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="bi bi-key mr-2"></i>
                  Ubah Kata Sandi
                </Link>
              </li>
              <li className="border-t">
                <button
                  onClick={handleLogoutClick}
                  className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                >
                  <i className="bi bi-box-arrow-right mr-2"></i>
                  Keluar
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
