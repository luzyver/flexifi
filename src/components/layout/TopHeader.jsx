import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import DateRangeFilter from '../common/DateRangeFilter';
import { useState } from 'react';
import { Menu, Filter, Sun, Moon, User, Key, LogOut, ChevronDown } from 'lucide-react';

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
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const handleLogoutClick = () => {
    onLogout();
    setShowUserMenu(false);
  };

  const showFilters = location.pathname === '/' || location.pathname === '/history';

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dasbor';
      case '/add-transaction': return 'Tambah Transaksi';
      case '/history': return 'Riwayat Transaksi';
      case '/categories': return 'Kategori';
      case '/change-password': return 'Ubah Kata Sandi';
      case '/activation-codes': return 'Kode Aktivasi';
      default: return '';
    }
  };

  return (
    <div className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-40">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            onClick={onMobileMenuToggle}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page Title */}
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-primary-600 dark:text-primary-400">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Filter Controls - Desktop */}
          {showFilters && (
            <div className="hidden lg:block">
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

          {/* Mobile Filter Toggle */}
          {showFilters && (
            <button 
              className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              onClick={toggleMobileFilters}
            >
              <Filter className="w-5 h-5" />
            </button>
          )}
          
          {/* Theme Toggle */}
          <button
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            title={isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          {/* User Menu */}
          <div className="relative">
            <button 
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">{username}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <Link 
                  to="/change-password" 
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Key className="w-4 h-4" />
                  <span>Ubah Kata Sandi</span>
                </Link>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button 
                  onClick={handleLogoutClick} 
                  className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Dropdown */}
      {showFilters && showMobileFilters && (
        <div className="absolute top-16 right-0 left-0 lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-40">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter Transaksi</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter Tanggal</label>
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
            
            <button 
              className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={toggleMobileFilters}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopHeader;