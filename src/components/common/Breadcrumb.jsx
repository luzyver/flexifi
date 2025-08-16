import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, Clock, Tags, Key, ChevronRight } from 'lucide-react';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();
  
  // Default breadcrumb mapping
  const breadcrumbMap = {
    '/': { label: 'Dasbor', icon: Home },
    '/add-transaction': { label: 'Tambah Transaksi', icon: Plus },
    '/history': { label: 'Riwayat Transaksi', icon: Clock },
    '/categories': { label: 'Kategori', icon: Tags },
    '/change-password': { label: 'Ubah Kata Sandi', icon: Key },
    '/activation-codes': { label: 'Kode Aktivasi', icon: Key }
  };

  // Use custom items if provided, otherwise generate from current path
  const items = customItems || (() => {
    const breadcrumbItems = [{ label: 'Dasbor', path: '/', icon: Home }];
    
    if (location.pathname !== '/') {
      const currentPage = breadcrumbMap[location.pathname];
      if (currentPage) {
        breadcrumbItems.push({
          label: currentPage.label,
          path: location.pathname,
          icon: currentPage.icon,
          active: true
        });
      }
    } else {
      breadcrumbItems[0].active = true;
    }
    
    return breadcrumbItems;
  })();

  return (
    <nav aria-label="breadcrumb" className="mb-6 animate-fade-in">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            )}
            {item.active ? (
              <span className="flex items-center text-gray-900 dark:text-white font-medium">
                <item.icon className="w-4 h-4 mr-1" />
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.path} 
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <item.icon className="w-4 h-4 mr-1" />
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;