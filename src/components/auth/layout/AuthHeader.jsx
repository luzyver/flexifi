import React from 'react';

/**
 * AuthHeader - Komponen header untuk halaman autentikasi
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.title - Judul header
 * @param {string} props.subtitle - Subjudul header
 * @param {string} props.icon - Kelas ikon Bootstrap
 * @param {string} props.className - Kelas tambahan untuk header
 * @param {string} props.variant - Variant tampilan (default, auth)
 */
const AuthHeader = ({
  title = 'FlexiFi',
  subtitle = 'Kelola keuangan dengan mudah dan efisien',
  icon = 'bi-wallet2',
  className = '',
  variant = 'default'
}) => {
  // Jika className mengandung text-white atau variant adalah auth, tampilkan versi khusus
  if (className.includes('text-white') || variant === 'auth') {
    return (
      <div className={`auth-header ${className}`}>
        <div className="app-logo mb-3">
          <div className="mb-3 bg-white bg-opacity-10 p-3 rounded-circle d-inline-block">
            <i className={`bi ${icon} display-5 text-white`}></i>
          </div>
        </div>
        <h1 className="h2 fw-bold text-white mb-2">{title}</h1>
        {subtitle && <p className="text-white-50 mb-0">{subtitle}</p>}
      </div>
    );
  }
  
  // Tampilan default
  return (
    <div className={`auth-header ${className}`}>
      <div className="app-logo mb-3">
        <div className="logo-wrapper bg-primary bg-opacity-10 p-2 rounded-circle d-inline-block">
          <i className={`bi ${icon} text-primary fs-2`}></i>
        </div>
      </div>
      <h1 className="app-name h3 fw-bold text-primary mb-2">{title}</h1>
      {subtitle && <p className="app-description text-muted small mb-0">{subtitle}</p>}
    </div>
  );
};

export default AuthHeader;