import React from 'react';

/**
 * IconButton - Komponen tombol ikon yang dapat digunakan kembali
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.icon - Kelas ikon Bootstrap
 * @param {string} props.variant - Variant tombol (primary, secondary, dll)
 * @param {boolean} props.disabled - Apakah tombol dinonaktifkan
 * @param {Function} props.onClick - Handler untuk klik tombol
 * @param {string} props.className - Kelas tambahan untuk tombol
 * @param {Object} props.style - Style tambahan untuk tombol
 * @param {string} props.type - Tipe tombol (button, submit, reset)
 * @param {string} props.size - Ukuran tombol (sm, md, lg)
 * @param {string} props.tooltip - Teks tooltip
 * @param {string} props.ariaLabel - Teks aria-label untuk aksesibilitas
 */
const IconButton = ({
  icon,
  variant = 'primary',
  disabled = false,
  onClick,
  className = '',
  style = {},
  type = 'button',
  size = 'md',
  tooltip,
  ariaLabel
}) => {
  const defaultStyle = { 
    borderRadius: '50%', 
    width: size === 'lg' ? '40px' : size === 'sm' ? '28px' : '34px',
    height: size === 'lg' ? '40px' : size === 'sm' ? '28px' : '34px',
    padding: '0',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style
  };
  
  const iconSize = size === 'lg' ? 'fs-4' : size === 'sm' ? 'fs-6' : 'fs-5';
  
  return (
    <button 
      type={type} 
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={defaultStyle}
      title={tooltip}
      aria-label={ariaLabel || tooltip}
    >
      <i className={`bi ${icon} ${iconSize}`}></i>
    </button>
  );
};

export default IconButton;