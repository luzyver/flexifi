import React from 'react';
import { Link } from 'react-router-dom';

/**
 * LinkButton - Komponen tombol yang berfungsi sebagai tautan
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.to - Path tujuan untuk Link
 * @param {string} props.text - Teks tombol
 * @param {string} props.icon - Kelas ikon Bootstrap
 * @param {string} props.variant - Variant tombol (primary, outline-primary, link, dll)
 * @param {boolean} props.disabled - Apakah tombol dinonaktifkan
 * @param {string} props.className - Kelas tambahan untuk tombol
 * @param {Object} props.style - Style tambahan untuk tombol
 * @param {string} props.size - Ukuran tombol (sm, md, lg)
 * @param {boolean} props.external - Apakah tautan eksternal (bukan React Router)
 */
const LinkButton = ({
  to,
  text,
  icon,
  variant = 'primary',
  disabled = false,
  className = '',
  style = {},
  size = 'md',
  external = false
}) => {
  const defaultStyle = { 
    borderRadius: '8px', 
    padding: size === 'lg' ? '0.6rem 1.2rem' : size === 'sm' ? '0.3rem 0.6rem' : '0.4rem 0.8rem',
    fontSize: size === 'lg' ? '1rem' : size === 'sm' ? '0.8rem' : '0.9rem',
    ...style
  };
  
  const sizeClass = size === 'lg' ? 'btn-lg' : size === 'sm' ? 'btn-sm' : '';
  const buttonClass = `btn btn-${variant} ${sizeClass} ${className}`;
  
  const buttonContent = (
    <>
      {icon && <i className={`bi ${icon} me-2`}></i>}
      {text}
    </>
  );
  
  // Jika disabled, gunakan button biasa
  if (disabled) {
    return (
      <button 
        className={buttonClass}
        disabled
        style={defaultStyle}
      >
        {buttonContent}
      </button>
    );
  }
  
  // Jika external, gunakan tag a biasa
  if (external) {
    return (
      <a 
        href={to}
        className={buttonClass}
        style={defaultStyle}
        target="_blank"
        rel="noopener noreferrer"
      >
        {buttonContent}
      </a>
    );
  }
  
  // Gunakan React Router Link
  return (
    <Link 
      to={to}
      className={buttonClass}
      style={defaultStyle}
    >
      {buttonContent}
    </Link>
  );
};

export default LinkButton;