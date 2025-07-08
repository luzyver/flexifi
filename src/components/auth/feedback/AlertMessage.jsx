import React from 'react';

/**
 * AlertMessage - Komponen untuk menampilkan pesan peringatan atau informasi
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.type - Tipe alert (success, danger, warning, info, primary, secondary, light, dark)
 * @param {string} props.message - Pesan yang ditampilkan
 * @param {string} props.title - Judul alert (opsional)
 * @param {string} props.icon - Kelas ikon Bootstrap (opsional)
 * @param {boolean} props.dismissible - Apakah alert dapat ditutup
 * @param {Function} props.onDismiss - Handler untuk menutup alert
 * @param {string} props.className - Kelas tambahan untuk alert
 */
const AlertMessage = ({
  type = 'info',
  message,
  title,
  icon,
  dismissible = false,
  onDismiss,
  className = ''
}) => {
  // Jika tidak ada pesan, jangan tampilkan apa-apa
  if (!message) return null;
  
  // Tentukan ikon default berdasarkan tipe
  const defaultIcons = {
    success: 'bi-check-circle-fill',
    danger: 'bi-exclamation-triangle-fill',
    warning: 'bi-exclamation-circle-fill',
    info: 'bi-info-circle-fill',
    primary: 'bi-info-circle-fill',
    secondary: 'bi-gear-fill',
    light: 'bi-lightbulb-fill',
    dark: 'bi-shield-fill'
  };
  
  const alertIcon = icon || defaultIcons[type] || 'bi-info-circle-fill';
  
  return (
    <div 
      className={`alert alert-${type} ${dismissible ? 'alert-dismissible' : ''} ${className}`}
      role="alert"
    >
      <div className="d-flex align-items-center">
        <i className={`bi ${alertIcon} me-2`}></i>
        <div>
          {title && <strong className="me-1">{title}</strong>}
          {message}
        </div>
      </div>
      
      {dismissible && onDismiss && (
        <button 
          type="button" 
          className="btn-close" 
          aria-label="Close"
          onClick={onDismiss}
        ></button>
      )}
    </div>
  );
};

export default AlertMessage;