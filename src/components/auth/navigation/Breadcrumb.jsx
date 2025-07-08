import React from 'react';
import { Link } from 'react-router-dom';

/**
 * BreadcrumbItem - Komponen untuk item breadcrumb
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.to - Path tujuan untuk Link
 * @param {string} props.label - Label item
 * @param {string} props.icon - Kelas ikon Bootstrap
 * @param {boolean} props.active - Apakah item aktif (item terakhir)
 */
export const BreadcrumbItem = ({ to, label, icon, active = false }) => {
  const content = (
    <>
      {icon && <i className={`bi ${icon} me-1`}></i>}
      {label}
    </>
  );
  
  if (active) {
    return (
      <li className="breadcrumb-item active" aria-current="page">
        {content}
      </li>
    );
  }
  
  return (
    <li className="breadcrumb-item">
      {to ? <Link to={to}>{content}</Link> : content}
    </li>
  );
};

/**
 * Breadcrumb - Komponen untuk navigasi breadcrumb
 * 
 * @param {Object} props - Props komponen
 * @param {Array} props.items - Array objek item breadcrumb (to, label, icon, active)
 * @param {React.ReactNode} props.children - Komponen BreadcrumbItem
 * @param {string} props.divider - Karakter pemisah antar item
 * @param {string} props.className - Kelas tambahan untuk komponen
 * @param {Object} props.style - Style tambahan untuk komponen
 * @param {boolean} props.homeIcon - Apakah menampilkan ikon home di awal
 */
const Breadcrumb = ({
  items = [],
  children,
  divider = '/',
  className = '',
  style = {},
  homeIcon = true
}) => {
  // Tentukan style untuk divider
  const dividerStyle = {
    '--bs-breadcrumb-divider': `'${divider}'`
  };
  
  // Jika items disediakan, gunakan items untuk render
  // Jika tidak, gunakan children
  const renderItems = () => {
    if (items && items.length > 0) {
      return items.map((item, index) => (
        <BreadcrumbItem
          key={index}
          to={item.to}
          label={item.label}
          icon={item.icon}
          active={item.active || index === items.length - 1}
        />
      ));
    }
    
    return children;
  };
  
  return (
    <nav aria-label="breadcrumb" className={className} style={style}>
      <ol className="breadcrumb small" style={dividerStyle}>
        {homeIcon && (
          <BreadcrumbItem
            to="/"
            label="Home"
            icon="bi-house"
          />
        )}
        {renderItems()}
      </ol>
    </nav>
  );
};

export default Breadcrumb;