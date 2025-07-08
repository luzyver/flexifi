import React, { useState } from 'react';

/**
 * TabItem - Komponen untuk item tab
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.id - ID unik untuk tab
 * @param {string} props.title - Judul tab
 * @param {React.ReactNode} props.children - Konten tab
 * @param {string} props.icon - Kelas ikon Bootstrap
 * @param {boolean} props.disabled - Apakah tab dinonaktifkan
 * @param {string} props.badge - Teks badge pada tab
 * @param {string} props.badgeVariant - Warna badge (primary, secondary, dll)
 */
export const TabItem = ({ children }) => {
  return children;
};

/**
 * Tabs - Komponen untuk menampilkan tab navigasi
 * 
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Komponen TabItem
 * @param {string} props.defaultActiveKey - ID tab yang aktif secara default
 * @param {Function} props.onSelect - Fungsi yang dipanggil saat tab dipilih
 * @param {string} props.variant - Variant tab (tabs, pills, underline)
 * @param {boolean} props.justified - Apakah tab memiliki lebar yang sama
 * @param {boolean} props.fill - Apakah tab mengisi ruang yang tersedia
 * @param {string} props.className - Kelas tambahan untuk komponen
 * @param {Object} props.style - Style tambahan untuk komponen
 */
const Tabs = ({
  children,
  defaultActiveKey,
  activeKey,
  onSelect,
  variant = 'tabs',
  justified = false,
  fill = false,
  className = '',
  style = {}
}) => {
  // State untuk tab aktif
  const [stateActiveKey, setActiveKey] = useState(defaultActiveKey || '');
  
  // Ekstrak data tab dari children
  const tabs = React.Children.toArray(children).filter(
    child => React.isValidElement(child) && child.type === TabItem
  );
  
  // Gunakan activeKey dari props jika tersedia
  const currentActiveKey = activeKey !== undefined ? activeKey : stateActiveKey;
  
  // Handler untuk klik tab
  const handleSelect = (key) => {
    setActiveKey(key);
    if (onSelect) onSelect(key);
  };
  
  // Tentukan kelas variant
  const variantClass = {
    tabs: 'nav-tabs',
    pills: 'nav-pills',
    underline: 'nav-underline'
  }[variant];
  
  return (
    <div className={className} style={style}>
      <ul 
        className={`nav ${variantClass} ${justified ? 'nav-justified' : ''} ${fill ? 'nav-fill' : ''} mb-2 small`}
        role="tablist"
      >
        {tabs.map((tab) => {
          const {
            id,
            title,
            icon,
            disabled,
            badge,
            badgeVariant = 'primary'
          } = tab.props;
          
          // Gunakan eventKey jika tersedia, jika tidak gunakan id
          const tabKey = tab.props.eventKey || id;
          const isActive = tabKey === currentActiveKey;
          
          return (
            <li className="nav-item" role="presentation" key={id}>
              <button
                className={`nav-link ${isActive ? 'active' : ''} py-2`}
                id={`${tabKey}-tab`}
                data-bs-toggle="tab"
                type="button"
                role="tab"
                aria-controls={tabKey}
                aria-selected={isActive}
                onClick={() => !disabled && handleSelect(tabKey)}
                disabled={disabled}
              >
                {icon && <i className={`bi ${icon} ${title ? 'me-2' : ''}`}></i>}
                {title}
                {badge && (
                  <span className={`badge text-bg-${badgeVariant} ms-2`}>{badge}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      
      <div className="tab-content">
        {tabs.map((tab) => {
          const { id, children } = tab.props;
          // Gunakan eventKey jika tersedia, jika tidak gunakan id
          const tabKey = tab.props.eventKey || id;
          const isActive = tabKey === currentActiveKey;
          
          return (
            <div
              className={`tab-pane fade ${isActive ? 'show active' : ''}`}
              id={tabKey}
              role="tabpanel"
              aria-labelledby={`${tabKey}-tab`}
              key={tabKey}
            >
              {children}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;