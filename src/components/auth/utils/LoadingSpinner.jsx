import React from 'react';

/**
 * LoadingSpinner - Komponen untuk menampilkan indikator loading
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.size - Ukuran spinner (sm, md, lg)
 * @param {string} props.variant - Warna spinner (primary, secondary, success, danger, warning, info, light, dark)
 * @param {string} props.text - Teks yang ditampilkan di samping spinner
 * @param {boolean} props.fullPage - Apakah spinner ditampilkan fullpage dengan overlay
 * @param {string} props.className - Kelas tambahan untuk komponen
 */
const LoadingSpinner = ({
  size = 'md',
  variant = 'primary',
  text = '',
  fullPage = false,
  className = ''
}) => {
  // Tentukan kelas ukuran
  const sizeClass = {
    sm: 'spinner-border-sm',
    md: 'spinner-border-sm',
    lg: '' // Custom class, perlu didefinisikan di CSS
  }[size];
  
  // Spinner dasar dengan styling baru
  const spinner = (
    <div className="loading-spinner-circle" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
  
  // Spinner dengan teks
  const spinnerWithText = text ? (
    <div className="loading-spinner">
      {spinner}
      <div className="loading-spinner-text">{text}</div>
    </div>
  ) : spinner;
  
  // Jika fullPage, tampilkan dengan overlay
  if (fullPage) {
    return (
      <div className="loading-spinner">
        {spinner}
        {text && <div className="loading-spinner-text">{text}</div>}
      </div>
    );
  }
  
  return spinnerWithText;
};

export default LoadingSpinner;