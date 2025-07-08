import React from 'react';

/**
 * PrimaryButton - Komponen tombol utama yang dapat digunakan kembali
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.text - Teks tombol
 * @param {string} props.icon - Kelas ikon Bootstrap
 * @param {string} props.variant - Variant tombol (primary, secondary, dll)
 * @param {boolean} props.disabled - Apakah tombol dinonaktifkan
 * @param {Function} props.onClick - Handler untuk klik tombol
 * @param {string} props.className - Kelas tambahan untuk tombol
 * @param {Object} props.style - Style tambahan untuk tombol
 * @param {string} props.type - Tipe tombol (button, submit, reset)
 * @param {string} props.size - Ukuran tombol (sm, md, lg)
 */
const PrimaryButton = ({
  text,
  icon,
  variant = 'primary',
  disabled = false,
  onClick,
  className = '',
  style = {},
  type = 'button',
  size = 'md'
}) => {
  const defaultStyle = { 
    borderRadius: '8px', 
    padding: size === 'lg' ? '0.6rem 1.2rem' : size === 'sm' ? '0.3rem 0.6rem' : '0.4rem 0.8rem',
    fontSize: size === 'lg' ? '1rem' : size === 'sm' ? '0.8rem' : '0.9rem',
    ...style
  };
  
  const sizeClass = size === 'lg' ? 'btn-lg' : size === 'sm' ? 'btn-sm' : '';
  
  return (
    <button 
      type={type} 
      className={`btn btn-${variant} ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={defaultStyle}
    >
      {icon && <i className={`bi ${icon} me-2`}></i>}
      {text}
    </button>
  );
};

export default PrimaryButton;