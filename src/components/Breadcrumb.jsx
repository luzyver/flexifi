import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();
  
  // Default breadcrumb mapping
  const breadcrumbMap = {
    '/': { label: 'Dashboard', icon: 'bi-house-door' },
    '/add-transaction': { label: 'Add Transaction', icon: 'bi-plus-circle' },
    '/history': { label: 'Transaction History', icon: 'bi-clock-history' },
    '/categories': { label: 'Categories', icon: 'bi-tags' },
    '/change-password': { label: 'Change Password', icon: 'bi-key' },
    '/activation-codes': { label: 'Activation Codes', icon: 'bi-key-fill' }
  };

  // Use custom items if provided, otherwise generate from current path
  const items = customItems || (() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems = [{ label: 'Dashboard', path: '/', icon: 'bi-house-door' }];
    
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
    <nav aria-label="breadcrumb" className="mb-4 fade-in">
      <ol className="breadcrumb">
        {items.map((item, index) => (
          <li 
            key={index} 
            className={`breadcrumb-item ${item.active ? 'active' : ''}`}
            aria-current={item.active ? 'page' : undefined}
          >
            {item.active ? (
              <span>
                <i className={`${item.icon} me-1`}></i>
                {item.label}
              </span>
            ) : (
              <Link to={item.path} className="text-decoration-none">
                <i className={`${item.icon} me-1`}></i>
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