import React from 'react';

/**
 * OutlineButton - Komponen tombol outline yang dapat digunakan kembali
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.text - Teks tombol
 * @param {string} props.icon - Kelas ikon Bootstrap
 * @param {string} props.variant - Variant tombol (primary, secondary, dll)
 * @param {boolean} props.disabled - Apakah tombol dinonaktifkan
 * @param {Function} props.onClick - Handler untuk klik tombol
 * @param {string} props.className - Kelas tambahan untuk tombol
 * @param {Object} props.style - Style tambahan untuk tombol
 */
const OutlineButton = ({
  text,
  icon,
  variant = 'primary',
  disabled = false,
  onClick,
  className = '',
  style = {}
}) => {
  const defaultStyle = { 
    borderRadius: '8px', 
    padding: '0.4rem 0.8rem',
    fontSize: '0.9rem',
    ...style
  };
  
  return (
    <button 
      type="button" 
      className={`btn btn-outline-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={defaultStyle}
    >
      {icon && <i className={`bi ${icon} me-2`}></i>}
      {text}
    </button>
  );
};

export default OutlineButton;