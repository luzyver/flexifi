import React from 'react';

/**
 * Badge - Komponen untuk menampilkan badge/label
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.text - Teks yang ditampilkan di badge
 * @param {string} props.variant - Warna badge (primary, secondary, success, danger, warning, info, light, dark)
 * @param {boolean} props.pill - Apakah badge berbentuk pill (rounded)
 * @param {string} props.size - Ukuran badge (sm, md, lg)
 * @param {string} props.icon - Kelas ikon Bootstrap
 * @param {string} props.className - Kelas tambahan untuk komponen
 * @param {Object} props.style - Style tambahan untuk komponen
 */
const Badge = ({
  text,
  variant = 'primary',
  pill = false,
  size = 'md',
  icon = '',
  className = '',
  style = {}
}) => {
  // Tentukan kelas ukuran
  const sizeClass = {
    sm: 'badge-sm', // Custom class, perlu didefinisikan di CSS
    md: '',
    lg: 'badge-lg' // Custom class, perlu didefinisikan di CSS
  }[size];
  
  // Tentukan padding berdasarkan ukuran
  const sizeStyle = {
    sm: { fontSize: '0.65rem', padding: '0.1rem 0.35rem' },
    md: { fontSize: '0.75rem', padding: '0.2rem 0.5rem' },
    lg: { fontSize: '0.85rem', padding: '0.25rem 0.6rem' }
  }[size];
  
  return (
    <span 
      className={`badge text-bg-${variant} ${pill ? 'rounded-pill' : ''} ${sizeClass} ${className}`}
      style={{ ...sizeStyle, ...style }}
    >
      {icon && <i className={`bi ${icon} ${text ? 'me-1' : ''}`}></i>}
      {text}
    </span>
  );
};

export default Badge;